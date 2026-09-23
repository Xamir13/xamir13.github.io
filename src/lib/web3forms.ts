/* ====================================================================
   WEB3FORMS CONFIGURATION — THE ONE PLACE TO MANAGE THE API KEY
   ====================================================================

   ▸ این فایل تنها محل نگهداری کلید Web3Forms است.
   ▸ To replace the key: edit the constant below (or set
     NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in `.env` to override it).

   Docs: https://docs.web3forms.com
   Endpoint: POST https://api.web3forms.com/submit

   ARCHITECTURE NOTE (important):
   Web3Forms's free plan only accepts submissions made from the BROWSER
   (server-side calls get HTTP 403: "Use our API in client side…").
   Therefore this module is imported by the contact form component and
   submits directly from the client. The access key is a public
   identifier by design in Web3Forms's client-side architecture — it is
   NOT a secret password. All other protections (validation, honeypot,
   rate limiting, inbox archiving) live in /api/contact.
   ==================================================================== */

/** ⬇️ REPLACE THIS PLACEHOLDER WITH YOUR REAL WEB3FORMS ACCESS KEY ⬇️ */
const WEB3FORMS_KEY_PLACEHOLDER = "3c4350df-3a30-40a0-bd2c-c7e3df93925d";

/** Env var wins when present; otherwise the constant above is used. */
export const WEB3FORMS_ACCESS_KEY: string =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? WEB3FORMS_KEY_PLACEHOLDER;

export type Web3FormsPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type Web3FormsResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Submit a contact message through Web3Forms — CLIENT-SIDE (required
 * by the free plan). Returns a friendly Persian message on failure.
 */
export async function submitContactViaWeb3Forms(
  payload: Web3FormsPayload
): Promise<Web3FormsResult> {
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: payload.subject,
        from_name: "وب‌سایت امیرعلی طاهری",
        name: payload.name,
        email: payload.email,
        message: payload.message,
      }),
    });

    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!res.ok || !json?.success) {
      console.error(
        `[web3forms] submission failed: HTTP ${res.status}`,
        json?.message ?? ""
      );
      return {
        ok: false,
        message:
          res.status === 403
            ? "کلید Web3Forms معتبر نیست یا منقضی شده است. لطفاً کلید را در src/lib/web3forms.ts بررسی کنید."
            : "ارسال پیام با خطا مواجه شد. لطفاً بعداً دوباره تلاش کنید.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      message:
        "خطای شبکه. لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.",
    };
  }
}
