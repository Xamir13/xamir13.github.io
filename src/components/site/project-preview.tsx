"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CircleCheck, X } from "lucide-react";

import { Badge } from "@/components/site/primitives";
import { useLang } from "@/lib/lang";
import { withBase } from "@/lib/paths";
import { fmtNum } from "@/lib/blog-i18n";
import type { Project } from "@/lib/site-data";

/* ------------------------------------------------------------------ */
/* In-site project preview — opened from the project card's «پیش‌نمایش»*/
/* button. Shows the project's own details (logo, overview, key        */
/* features, tech stack) in an overlay consistent with the certificate */
/* lightbox: ESC / backdrop click closes, Tab is trapped inside the    */
/* dialog, body scroll is locked, focus is restored to the trigger.    */
/* No external navigation happens here — the «مشاهده صفحه پروژه» action*/
/* stays on the site (detail page). Fully responsive, nothing cropped. */
/* Fully bilingual (fa/en) through the standard language system.       */
/* ------------------------------------------------------------------ */

const PREVIEW_FEATURE_COUNT = 6;

export function ProjectPreviewModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { lang, t, pick } = useLang();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const open = project !== null;

  React.useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;

    const focusables = () => {
      const root = dialogRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        /* Minimal focus trap: wrap Tab around the dialog's focusables. */
        const elements = focusables();
        if (elements.length === 0) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  /* Language-aware project fields (EN variant when available). */
  const title = project ? pick(project.title, project.titleEn) : "";
  const tags = project
    ? lang === "en"
      ? (project.tagsEn ?? project.tags)
      : project.tags
    : [];
  const overview = project
    ? pick(project.overview, project.overviewEn)
    : "";
  const features = project
    ? lang === "en"
      ? (project.featuresEn ?? project.features)
      : project.features
    : [];

  return (
    <>
      {project
        ? /* Portal to <body>: fixed positioning must resolve against the
             viewport — rendered in-place it inherits the section's
             .depth-region `perspective` as its containing block, so the
             overlay/close button land inside the section box instead of
             covering the real screen. Rendered conditionally — an outer
             AnimatePresence cannot wrap a portal object. */
          createPortal(
            <div
              key="project-preview"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${t("proj.previewTitle")} ${title}`}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm [overscroll-behavior:contain]"
              onClick={onClose}
            >
              {/* Close — dark glass keeps it visible over the dark backdrop AND
                  over the white modal corner on small screens. */}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t("lb.close")}
                className="absolute end-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border/60 bg-card text-card-foreground shadow-2xl [overscroll-behavior:contain]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 space-y-5">
              {/* Header — mirrors the detail-page hero treatment */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                  <img
                    src={withBase(project.icon)}
                    alt={t("preview.logoAlt").replace("{n}", title)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="border-border bg-transparent text-foreground text-xs font-semibold"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="text-muted-foreground leading-relaxed space-y-3 text-sm sm:text-base">
                {overview.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key features (preview — full list on the project page) */}
              {features.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-foreground">
                    {t("preview.features")}
                  </h4>
                  <ul className="space-y-2.5">
                    {features
                      .slice(0, PREVIEW_FEATURE_COUNT)
                      .map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CircleCheck
                            className="h-5 w-5 text-primary shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                  </ul>
                  {features.length > PREVIEW_FEATURE_COUNT ? (
                    <p className="text-xs text-muted-foreground/80">
                      {t("preview.moreFeatures").replace(
                        "{n}",
                        fmtNum(features.length - PREVIEW_FEATURE_COUNT, lang)
                      )}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Technologies */}
              {project.techAll.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-foreground">
                    {t("preview.tech")}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techAll.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full border border-border/70 bg-muted/60 px-3 py-1 text-xs text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Footer action — in-site detail page (no external nav) */}
              <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
                <Link
                  href={`/projects/${project.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary h-10 px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {t("preview.viewProject")}
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
                <span className="text-xs text-muted-foreground">
                  {t("preview.note")}
                </span>
              </div>
            </div>
          </motion.div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
