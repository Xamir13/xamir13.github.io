import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/* Mutation-only route (PATCH/DELETE, no GET): force-dynamic keeps it out of
   static prerendering entirely — GitHub Pages simply never sees it, while
   server deployments keep live behavior. */
export const dynamic = "force-dynamic";

/**
 * Toggle the read flag of a contact message — or set an explicit field when
 * a JSON body is provided: `{ spam?: boolean }`.
 * A request without a body keeps the legacy read-toggle behavior.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "پیام پیدا نشد." }, { status: 404 });
    }

    let spam: boolean | undefined;
    try {
      const body = (await request.json()) as { spam?: unknown };
      if (body && typeof body.spam === "boolean") {
        spam = body.spam;
      }
    } catch {
      /* no body (or invalid JSON) → legacy read toggle below */
    }

    const updated = await db.contactMessage.update({
      where: { id },
      data: spam === undefined ? { read: !existing.read } : { spam },
    });
    return NextResponse.json({ message: updated });
  } catch (error) {
    console.error("[admin-messages] patch failed:", error);
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}

/** Delete a contact message. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "پیام پیدا نشد." }, { status: 404 });
    }
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin-messages] delete failed:", error);
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}
