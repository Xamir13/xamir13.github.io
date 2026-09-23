"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@/components/site/primitives";
import { submitContactViaFormspark } from "@/lib/formspark";
import { useLang } from "@/lib/lang";

type FormStatus = "idle" | "sending" | "success" | "error";

/* ====================================================================
   CONTACT FORM — dual-channel real delivery

   Flow (see src/lib/mailer.ts + src/lib/formspark.ts):
   1. Client-side validation (required fields + email format).
   2. PRIMARY: the site's OWN /api/contact → zod validation, rate
      limiting, admin-inbox archive and REAL SMTP delivery to the
      CONTACT_TO inbox. No third-party origin filters; credentials
      never leave the server. The route stores the message BEFORE
      attempting SMTP, so 502/503 replies mean "archived, not mailed".
   3. FALLBACK: Formspark (browser-side POST) — used only when the API
      route cannot deliver (SMTP env vars not set yet → 503, SMTP
      failure → 502, or the API is unreachable). If the message was
      already archived by step 2, no duplicate archive is written.
   4. Honest states: sending / success / error — no fake success.
      Rate-limited requests (429) are NOT retried via the fallback.
   Duplicate protection: the submit button stays disabled while
   sending, and the form switches to the success panel afterwards.
   ==================================================================== */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const { t } = useLang();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [error, setError] = React.useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return; /* duplicate-submission guard */
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const payload = {
      name: (data.get("name") as string | null)?.trim() || "",
      email: (data.get("email") as string | null)?.trim() || "",
      subject:
        (data.get("subject") as string | null)?.trim() || t("form.defaultSubject"),
      message: (data.get("message") as string | null)?.trim() || "",
    };

    /* Explicit client-side validation (beyond the browser's built-in). */
    if (payload.name.length < 2) {
      setStatus("error");
      setError(t("form.errName"));
      return;
    }
    if (!EMAIL_RE.test(payload.email)) {
      setStatus("error");
      setError(t("form.errEmail"));
      return;
    }
    if (payload.message.length < 10) {
      setStatus("error");
      setError(t("form.errMsg"));
      return;
    }

    /* Honeypot — bots fill the hidden "company" field: pretend success. */
    if ((data.get("company") as string | null)?.trim()) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    setError("");

    /* -------- Channel 1 (primary): the site's own SMTP-backed API. --- */
    let storedByApi = false; /* route archived it even though it erred */
    let apiUnreachable = false; /* fetch itself failed (network down) */
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        /* Delivered over SMTP + archived in the admin inbox. */
        setStatus("success");
        form.reset();
        return;
      }
      if (res.status === 502 || res.status === 503) storedByApi = true;
      else if (res.status === 429) {
        /* Rate-limited — respect it, do not retry via the fallback. */
        setStatus("error");
        setError(t("form.errRate"));
        return;
      }
    } catch {
      apiUnreachable = true;
    }

    /* -------- Channel 2 (fallback): Formspark, browser-side. -------- */
    const result = await submitContactViaFormspark(payload);
    if (result.ok) {
      setStatus("success");
      form.reset();
      if (!storedByApi) {
        /* Nothing stored the message yet — archive best-effort. */
        void fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, archiveOnly: true }),
        }).catch(() => undefined);
      }
      return;
    }

    /* Both channels failed — honest error; the entered data stays. */
    setStatus("error");
    setError(
      t(
        result.reason === "network" && apiUnreachable
          ? "form.errNetwork"
          : "form.errSubmit"
      )
    );
  };

  return (
    <Card className="w-full max-w-[560px] transition-all duration-200 bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/30">
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-xl">{t("form.title")}</CardTitle>
        <CardDescription>{t("form.desc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
            <p className="text-lg font-medium text-foreground">{t("form.successTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("form.successDesc")}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStatus("idle")}
              className="mt-2"
            >
              {t("form.again")}
            </Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="grid gap-5" noValidate>
            {/* Honeypot — hidden from humans, catches bots */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-company">شرکت</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            {status === "error" ? (
              <div
                className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="contact-name">{t("form.name")}</Label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                placeholder={t("form.namePh")}
                required
                minLength={2}
                autoComplete="name"
                className="bg-background"
                disabled={status === "sending"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-email">{t("form.email")}</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="bg-background"
                dir="ltr"
                disabled={status === "sending"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-subject">{t("form.subject")}</Label>
              <Input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder={t("form.subjectPh")}
                autoComplete="off"
                className="bg-background"
                disabled={status === "sending"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-message">{t("form.message")}</Label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder={t("form.messagePh")}
                rows={5}
                required
                minLength={10}
                maxLength={5000}
                className="bg-background min-h-[120px]"
                disabled={status === "sending"}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="gap-2"
              disabled={status === "sending"}
              aria-busy={status === "sending"}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("form.sending")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t("form.send")}
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
