import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { isMailConfigured, sendContactEmail } from "@/lib/mailer";

/* GitHub Pages static export has no Node runtime: the handler below is kept
   intact for server deployments, but during export builds POST simply
   returns 503 — the browser-side Formspark/Web3Forms fallback in
   contact-form.tsx delivers messages on static hosting. */
const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

const contactSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ نویسه باشد.").max(120),
  email: z.string().trim().email("ایمیل معتبر نیست.").max(200),
  subject: z.string().trim().max(200).optional().default("پیام از وب‌سایت"),
  message: z.string().trim().min(10, "پیام باید حداقل ۱۰ نویسه باشد.").max(5000),
  /* When true the client has ALREADY delivered the message through
     Formspark; this call only validates, rate-limits and archives the
     message. */
  archiveOnly: z.boolean().optional().default(false),
});

/* ------------------------------------------------------------------ */
/* Basic in-memory abuse protection (per server instance):             */
/*  - minimum 30s between submissions from the same IP                 */
/*  - maximum 5 submissions per hour from the same IP                  */
/* Good enough for a personal site; swaps cleanly for a real limiter   */
/* (Redis etc.) if the deployment ever grows.                          */
/* ------------------------------------------------------------------ */

const MIN_INTERVAL_MS = 30_000;
const HOUR_WINDOW_MS = 60 * 60_000;
const MAX_PER_HOUR = 5;

const hits = new Map<string, number[]>();
let lastSweep = Date.now();

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRate(ip: string): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();

  /* Periodic sweep so the map cannot grow unbounded. */
  if (now - lastSweep > HOUR_WINDOW_MS) {
    for (const [key, times] of hits) {
      const fresh = times.filter((t) => now - t < HOUR_WINDOW_MS);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
    lastSweep = now;
  }

  const times = (hits.get(ip) ?? []).filter((t) => now - t < HOUR_WINDOW_MS);

  if (times.length > 0 && now - times[times.length - 1]! < MIN_INTERVAL_MS) {
    const waitMs = MIN_INTERVAL_MS - (now - times[times.length - 1]!);
    return { ok: false, retryAfterSec: Math.ceil(waitMs / 1000) };
  }
  if (times.length >= MAX_PER_HOUR) {
    const waitMs = HOUR_WINDOW_MS - (now - times[0]!);
    return { ok: false, retryAfterSec: Math.ceil(waitMs / 1000) };
  }

  times.push(now);
  hits.set(ip, times);
  return { ok: true };
}

export async function POST(request: Request) {
  if (STATIC_EXPORT) {
    return NextResponse.json(
      { error: "Static build: use the client-side contact fallback." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    // Honeypot: bots fill the hidden "company" field — silently accept & drop.
    if (typeof body.company === "string" && body.company.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "اطلاعات فرم معتبر نیست.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const rate = checkRate(clientIp(request));
    if (!rate.ok) {
      return NextResponse.json(
        {
          error: `تعداد درخواست‌ها زیاد است؛ لطفاً ${rate.retryAfterSec} ثانیه دیگر دوباره تلاش کنید.`,
        },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSec ?? 30) } }
      );
    }

    const { name, email, subject, message, archiveOnly } = parsed.data;

    /* The message is always archived in the admin inbox first. */
    await db.contactMessage.create({
      data: { name, email, subject, message },
    });

    /* archiveOnly → the client delivered via Web3Forms already. */
    if (archiveOnly) {
      return NextResponse.json({ ok: true, archived: true });
    }

    /* Direct API callers (no Web3Forms): deliver over SMTP when
       configured; fail HONESTLY otherwise — no fake success. */
    if (!isMailConfigured()) {
      console.warn(
        "[contact] SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS/SMTP_PORT); message stored in admin inbox only."
      );
      return NextResponse.json(
        {
          error:
            "پیام شما در صندوق مدیریت ذخیره شد، اما ارسال ایمیل هنوز پیکربندی نشده است. لطفاً از طریق ایمیل مستقیم در تماس باشید.",
        },
        { status: 503 }
      );
    }

    try {
      const { messageId } = await sendContactEmail({ name, email, subject, message });
      return NextResponse.json({ ok: true, delivered: true, messageId });
    } catch (mailError) {
      console.error("[contact] SMTP delivery failed:", mailError);
      return NextResponse.json(
        {
          error:
            "پیام ذخیره شد اما ارسال ایمیل با خطا مواجه شد. لطفاً بعداً دوباره تلاش کنید یا مستقیم ایمیل بزنید.",
        },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("[contact] failed to store message:", error);
    return NextResponse.json(
      { error: "خطای سرور. لطفاً بعداً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
