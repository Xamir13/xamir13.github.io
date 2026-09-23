/* ====================================================================
   FORMSPARK FALLBACK — secondary contact-form delivery channel
   ====================================================================

   ▸ PRIMARY delivery is the site's OWN /api/contact route (SMTP via
     src/lib/mailer.ts). This module is the browser-side FALLBACK used
     only when that route cannot deliver (SMTP env vars not set yet →
     503, SMTP failure → 502, or the API unreachable).
   ▸ The form id in the action URL is a public endpoint identifier by
     design — it is NOT a secret and NO API key is required.
   ▸ NOTE: Formspark's dashboard-side spam protection may restrict
     which site origins may submit (testing showed HTTP 403 "Rejected
     by spam protection" for non-allowlisted origins). If it rejects,
     the UI shows the generic translated error — never a crash, and
     the message still lives in the admin inbox via the primary route.

   Docs: https://docs.formspark.io
   Endpoint: POST https://submit-form.com/sTeNHR6s8

   Response contract:
   • HTTP 2xx            → delivered (body echoes the submission JSON).
   • Non-2xx (403/302 …) → rejected (spam protection, bad id, …).
   The UI maps failures to friendly, already-translated messages; the
   visitor never sees technical details and no visitor data is logged
   to the console.
   ==================================================================== */

export const FORMSPARK_ACTION = "https://submit-form.com/sTeNHR6s8";

export type FormsparkPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type FormsparkResult =
  | { ok: true }
  | { ok: false; reason: "rejected" | "network" };

/**
 * Submit the contact message to Formspark — client-side JSON POST.
 * Never throws; failures return a coarse reason that the contact form
 * maps to a translated, visitor-friendly message.
 */
export async function submitContactViaFormspark(
  payload: FormsparkPayload
): Promise<FormsparkResult> {
  try {
    const res = await fetch(FORMSPARK_ACTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        /* Formspark email-subject override so the owner's inbox shows
           the visitor's subject line. */
        "_email.subject": payload.subject,
      }),
    });

    if (!res.ok) return { ok: false, reason: "rejected" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}
