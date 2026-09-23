import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";
import { PremiumCursor } from "@/components/site/premium-cursor";
import { LangProvider } from "@/lib/lang";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { TerminalBoot } from "@/components/site/terminal-boot";
import { AiAssistant } from "@/components/site/ai-assistant";
import { SkipLink, PrintFooter } from "@/components/site/localized-chrome";
import { withBase } from "@/lib/paths";

/* Applied to <html> BEFORE first paint so a stored English choice never
   flashes the wrong direction; React state catches up after hydration. */
const LANG_BOOTScript = `try{var l=localStorage.getItem("site-lang");if(l==="en"){var d=document.documentElement;d.lang="en";d.dir="ltr"}}catch(e){}`;

/* Applied BEFORE first paint: the terminal boot screen is skipped for
   repeat visits in the same session. Reduced-motion users still get the
   loader's minimal functional variant (CSS strips all animation there). */
const BOOT_SKIPScript = `try{if(sessionStorage.getItem("term-boot-seen")){document.documentElement.setAttribute("data-boot-skip","")}}catch(e){}`;

export const metadata: Metadata = {
  /* metadataBase stays ORIGIN-only: Next.js itself applies the basePath
     to metadata URLs (og images, alternates), so the deployment sub-path
     must not be baked into the base URL as well. */
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_ORIGIN ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000"
  ),
  title: "Xamir",
  description:
    "توسعه‌دهنده‌ی ۱۴ ساله از اصفهان؛ سازنده‌ی محصولات وب سریع و کاربرپسند با React، Next.js، TypeScript و Node.js؛ نویسنده بلاگ فارسی درباره توسعه وب.",
  keywords: [
    "امیرعلی طاهری",
    "توسعه‌دهنده فول‌استک",
    "برنامه‌نویسی",
    "بلاگ فارسی",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "امیرعلی طاهری" }],
  alternates: {
    types: {
      "application/rss+xml": [{ url: withBase("/feed.xml"), title: "بلاگ امیرعلی طاهری (RSS)" }],
    },
  },
  icons: {
    /* Icons are NOT auto-prefixed by Next — needs withBase explicitly. */
    icon: withBase("/favicon.svg"),
  },
  openGraph: {
    title: "امیرعلی طاهری — توسعه‌دهنده فول‌استک",
    description:
      "توسعه‌دهنده‌ی ۱۴ ساله از اصفهان؛ سیستم‌هایی طراحی می‌کنم که مقیاس‌پذیرند.",
    type: "website",
    locale: "fa_IR",
    images: [
      {
        url: withBase("/images/nature.png"),
        width: 1200,
        height: 630,
        alt: "امیرعلی طاهری — توسعه‌دهنده فول‌استک",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "امیرعلی طاهری — توسعه‌دهنده فول‌استک",
    description:
      "توسعه‌دهنده‌ی ۱۴ ساله از اصفهان؛ سیستم‌هایی طراحی می‌کنم که مقیاس‌پذیرند.",
    images: [withBase("/images/nature.png")],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased print:pb-8">
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOTScript }} />
        <script dangerouslySetInnerHTML={{ __html: BOOT_SKIPScript }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LangProvider>
          {/* Terminal-style boot screen (once per session, reduced-motion aware). */}
          <TerminalBoot />
          {/* Premium desktop cursor (self-disables on touch/reduced-motion). */}
          <PremiumCursor />
          {/* English / فارسی switcher — the empty top corner opposite the navbar. */}
          <LanguageSwitcher />
          {/* Keyboard users: skip straight to the page's main content. */}
          <SkipLink />
          {children}
          {/* Print-only footer, stamped on every printed page. */}
          <PrintFooter />
          <Toaster />
          {/* The site's own AI assistant (browser-local WebGPU engine —
              loads nothing until the tiger button is opened). */}
          <AiAssistant />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
