"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useLang, type Lang } from "@/lib/lang";

/* ====================================================================
   LANGUAGE SWITCHER — compact EN / فا segmented pill

   • Fixed to the top INLINE-END corner of the viewport (physical
     top-LEFT in the default Persian RTL view — the empty corner
     opposite the navbar — and it mirrors to top-right automatically
     when the site flips to English/LTR, so it never collides with
     the header panel on any language or screen size).
   • Matches the navbar material (frosted glass, same border/shadow
     language). The active language is a solid primary pill.
   • Full keyboard + screen-reader support (role=group, aria-pressed,
     visible focus ring, tooltips with the full language names).
   ==================================================================== */

const OPTIONS: { code: Lang; label: string; title: string }[] = [
  { code: "en", label: "EN", title: "English" },
  { code: "fa", label: "فا", title: "فارسی" },
];

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="fixed top-4 end-4 z-30 md:top-6 md:end-6">
      <div
        role="group"
        aria-label={t("lang.aria")}
        className={cn(
          "flex items-center gap-1 rounded-full p-1",
          "bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl",
          "border border-border/40",
          "shadow-lg shadow-black/5 dark:shadow-zinc-950/40",
          "transition-colors duration-300"
        )}
      >
        {OPTIONS.map(({ code, label, title }) => {
          const active = lang === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={active}
              title={title}
              className={cn(
                "flex h-9 min-w-11 items-center justify-center rounded-full px-2.5",
                "text-xs font-semibold tracking-wide outline-none",
                "transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              )}
            >
              {code === "en" ? <span dir="ltr">EN</span> : <span>فا</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
