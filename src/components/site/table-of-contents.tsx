"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang";
import type { TocHeading } from "@/lib/toc";

export { headingId } from "@/lib/toc";

export function TableOfContents({
  headings,
  sectionWords,
}: {
  headings: TocHeading[];
  /** Estimated word count per heading section (server-computed). */
  sectionWords?: number[];
}) {
  const { lang, t } = useLang();
  const fmt = (n: number) =>
    lang === "fa"
      ? new Intl.NumberFormat("fa-IR").format(n)
      : String(n);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const hasHeadings = headings.length > 0;
  const totalWords = sectionWords?.reduce((a, b) => a + b, 0) ?? 0;

  /* Reading progress through the TOC itself: which chapter the reader is in. */
  const activeIndex = headings.findIndex((h) => h.id === activeId);
  const progress =
    hasHeadings && activeIndex >= 0
      ? Math.round(((activeIndex + 1) / headings.length) * 100)
      : 0;

  // Track which heading is currently in view.
  useEffect(() => {
    if (!hasHeadings) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const READING_LINE = 96; // matches the rootMargin top boundary

    const observer = new IntersectionObserver(
      () => {
        /* Full recalculation (scrollspy): the last heading whose top has
           crossed the reading line is active. Robust for the LAST section —
           once the reader scrolls past it, it stays active (progress reaches
           100%) instead of freezing on the previous chapter. */
        let current = elements[0]?.id ?? "";
        for (const el of elements) {
          if (el.getBoundingClientRect().top <= READING_LINE) current = el.id;
          else break;
        }
        setActiveId(current);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, hasHeadings]);

  /* The list is cheap to rebuild; React Compiler auto-memoizes it — the
     former manual useMemo broke when the localized fmt() joined deps. */
  const list = headings.map((h, i) => {
        const words = sectionWords?.[i];
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={activeId === h.id ? "true" : undefined}
              title={
                typeof words === "number" && words > 0
                  ? t("toc.sectionWords").replace("{n}", fmt(words))
                  : undefined
              }
              className={cn(
                "group flex items-start gap-2 rounded-md px-2 py-1.5 text-xs leading-5 transition-colors",
                h.level === 3 ? "ps-5" : "ps-2",
                activeId === h.id
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                  activeId === h.id ? "bg-primary" : "bg-border group-hover:bg-muted-foreground"
                )}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 line-clamp-2">{h.text}</span>
              {typeof words === "number" && words > 0 ? (
                <span
                  className={cn(
                    "shrink-0 pt-0.5 text-[9px] font-medium tabular-nums transition-colors",
                    activeId === h.id
                      ? "text-primary/80"
                      : "text-muted-foreground/60 group-hover:text-muted-foreground"
                  )}
                >
                  ~{fmt(words)}
                </span>
              ) : null}
            </a>
          </li>
        );
      });

  if (!hasHeadings) return null;

  return (
    <>
      {/* Desktop — fixed sidebar on the "end" side (left in RTL) */}
      <nav
        aria-label={t("toc.title")}
        className="fixed top-32 z-10 hidden w-56 max-w-[15rem] xl:block ltr:right-6 rtl:left-6 2xl:ltr:right-10 2xl:rtl:left-10 print:hidden"
      >
        <div className="rounded-xl border border-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-sm">
          <p className="mb-2 flex items-center gap-1.5 px-1 text-xs font-semibold text-foreground">
            <ListTree className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {t("toc.title")}
            {totalWords > 0 && (
              <span
                className="ms-auto text-[9px] font-medium text-muted-foreground"
                title={t("toc.wordsHint")}
              >
                ~{fmt(totalWords)} {t("toc.words")}
              </span>
            )}
          </p>
          {/* Chapter progress meter */}
          <div className="mb-2.5 px-1">
            <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-muted-foreground">
              <span>{t("toc.progress")}</span>
              <span
                className="text-primary"
                aria-live="polite"
              >
                {activeIndex >= 0
                  ? `${fmt(activeIndex + 1)} ${t("lb.of")} ${fmt(headings.length)} — ${fmt(progress)}٪`
                  : `${fmt(0)}٪`}
              </span>
            </div>
            <div
              className="h-1 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={t("toc.progress")}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <ul className="max-h-[55vh] space-y-0.5 overflow-y-auto pe-1">{list}</ul>
        </div>
      </nav>

      {/* Mobile / tablet — collapsible box above the content */}
      <details className="group mt-6 rounded-xl border border-border/60 bg-card/80 shadow-sm xl:hidden print:hidden">
        <summary className="flex cursor-pointer select-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-1.5">
            <ListTree className="h-4 w-4 text-primary" aria-hidden="true" />
            {t("toc.title")}
          </span>
          <span className="flex items-center gap-2">
            {totalWords > 0 && (
              <span className="text-[10px] font-medium text-muted-foreground">
                ~{fmt(totalWords)} {t("toc.words")}
              </span>
            )}
            {activeIndex >= 0 && (
              <span className="text-[10px] font-medium text-primary" aria-live="polite">
                {fmt(activeIndex + 1)}/{fmt(headings.length)} — {fmt(progress)}٪
              </span>
            )}
            <span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">
              ▾
            </span>
          </span>
        </summary>
        <ul className="max-h-64 space-y-0.5 overflow-y-auto border-t border-border/60 px-3 py-2">
          {list}
        </ul>
      </details>
    </>
  );
}
