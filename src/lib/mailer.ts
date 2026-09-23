import nodemailer, { type Transporter } from "nodemailer";

/* Server-only mail delivery for the contact form.
   ------------------------------------------------------------------ .
   Credentials live exclusively in environment variables — they are
   NEVER imported into client code (this module is only used by the
   /api/contact route handler).

   Required env vars (see .env.example):
     SMTP_HOST      e.g. smtp.gmail.com
     SMTP_PORT      e.g. 465
     SMTP_USER      the account that signs in (also the default From)
     SMTP_PASS      the password / Gmail App Password
     CONTACT_TO     recipient inbox (default: azazamir139@gmail.com)
   ------------------------------------------------------------------ */

export const CONTACT_RECIPIENT = process.env.CONTACT_TO ?? "azazamir139@gmail.com";

export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_PORT
  );
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!cachedTransporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === "true"
        : port === 465,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });
  }
  return cachedTransporter;
}

/* HTML-escape untrusted visitor input before embedding in the email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(
  payload: ContactPayload
): Promise<{ messageId: string }> {
  const transporter = getTransporter();
  const { name, email, subject, message } = payload;

  const text = [
    `پیام جدید از فرم تماس وب‌سایت`,
    `——————————————`,
    `نام: ${name}`,
    `ایمیل: ${email}`,
    `موضوع: ${subject}`,
    `——————————————`,
    message,
  ].join("\n");

  const html = `<!doctype html><html lang="fa" dir="rtl"><body style="font-family:Tahoma,Arial,sans-serif;background:#f4f4f5;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
    <div style="background:#16a34a;color:#fff;padding:14px 20px;font-size:15px;font-weight:bold;">پیام جدید از فرم تماس وب‌سایت</div>
    <div style="padding:20px;color:#18181b;font-size:14px;line-height:1.9;">
      <p><strong>نام:</strong> ${escapeHtml(name)}</p>
      <p><strong>ایمیل:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#16a34a;">${escapeHtml(email)}</a></p>
      <p><strong>موضوع:</strong> ${escapeHtml(subject)}</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0;" />
      <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  </div>
</body></html>`;

  const info = await transporter.sendMail({
    from: `"وب‌سایت امیرعلی طاهری" <${process.env.SMTP_USER}>`,
    /* Reply-To points at the visitor so replying goes to them directly. */
    replyTo: `${name} <${email}>`,
    to: CONTACT_RECIPIENT,
    subject: `فرم تماس: ${subject}`,
    text,
    html,
  });

  return { messageId: info.messageId };
}
