"use client";

import * as React from "react";
import Link from "next/link";

import { useLang } from "@/lib/lang";
import { Button } from "@/components/site/primitives";

/* ====================================================================
   LOCALIZED LAYOUT CHROME — client islands for the root layout / 404

   The root layout is a server component, so its fixed chrome (skip
   link, print footer) and the not-found page body used to be hardcoded
   Persian. These tiny client islands make them language-aware through
   the standard t()/pick() system — no one-off strings left anywhere.
   ==================================================================== */

/** Keyboard users: skip straight to the page's main content. */
export function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
    >
      {t("chrome.skip")}
    </a>
  );
}

/** Print-only footer, stamped on every printed page. */
export function PrintFooter() {
  const { t, lang } = useLang();
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    try {
      setDate(
        new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", {
          dateStyle: "long",
        }).format(new Date())
      );
    } catch {
      setDate("");
    }
  }, [lang]);

  return (
    <div
      aria-hidden="true"
      className="hidden print:fixed print:bottom-1 print:start-0 print:z-[999] print:block print:w-full print:border-t print:border-zinc-200 print:pt-1 print:text-center print:text-[10px] print:text-zinc-500"
    >
      {t("chrome.printFooter").replace("{d}", date)}
    </div>
  );
}

/** Language-aware 404 body (the route keeps its server shell). */
export function NotFoundBody() {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center text-center gap-5 max-w-md">
      <span className="text-7xl font-bold text-primary/90 md:text-8xl">
        {t("nf.code")}
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {t("nf.title")}
      </h1>
      <p className="text-muted-foreground leading-8">{t("nf.body")}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg" className="gap-2 shadow-lg">
          <Link href="/">{t("nf.home")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/blog">{t("nf.blog")}</Link>
        </Button>
      </div>
    </div>
  );
}
