"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, Maximize2, RotateCcw, X } from "lucide-react";

import { Badge, Button, Card } from "@/components/site/primitives";
import { useLang } from "@/lib/lang";
import { withBase } from "@/lib/paths";
import { FlipCard } from "@/components/site/flip-card";
import { TiltCard } from "@/components/site/tilt-card";
import type { Certification } from "@/lib/site-data";

/* ------------------------------------------------------------------ */
/* Certificate gallery — the whole card is interactive now: the FIRST
   click flips it open exactly like the Skills & Technologies cards
   (same flip scene/transition/a11y, via the shared FlipCard), revealing
   the certificate image prominently on the back face — aspect ratio
   preserved, never cropped. From there, clicking the image or the
   «مشاهده تصویر گواهینامه» action opens the shared fullscreen lightbox
   (near-fullscreen viewing size): previous/next via buttons, Arrow keys
   and touch swipe (all RTL-aware), directional slide transition,
   adjacent image preloading, and an «X از Y» counter.
   The card's original «مشاهده گواهینامه» button on the front still
   opens the lightbox directly. ESC / backdrop click closes; Tab is
   trapped inside the dialog; body scroll locked while open; focus
   returns to the triggering button. Cards without an image keep the
   original static layout.
/* ------------------------------------------------------------------ */

const faDigits = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

const SWIPE_THRESHOLD = 48;

type GalleryItem = {
  src: string;
  alt: string;
};

export function CertGallery({
  certifications,
}: {
  certifications: Certification[];
}) {
  const { lang, t, pick } = useLang();
  const items: GalleryItem[] = certifications
    .filter((c) => Boolean(c.image))
    .map((c) => ({
      src: withBase(c.image as string),
      alt: `${t("cert.alt")} ${pick(c.title, c.titleEn)} — ${c.issuer}`,
    }));

  /* Index into `items` (gallery positions), not into `certifications`. */
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  /* Direction of the last step (1 = next, -1 = prev) → slide animation. */
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [zoomed, setZoomed] = React.useState(false);
  const lastOpenIndex = React.useRef<number | null>(null);
  const triggerRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const touchStartX = React.useRef<number | null>(null);

  const total = items.length;

  const step = React.useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((cur) =>
        cur === null || total === 0 ? cur : (cur + dir + total) % total
      ),
    [total, setOpenIndex]
  );

  const go = React.useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setZoomed(false);
      step(dir);
    },
    [step, setZoomed]
  );

  /* Preload neighbors so arrow/swipe navigation feels instant. */
  React.useEffect(() => {
    if (openIndex === null || total < 2) return;
    for (const delta of [1, -1]) {
      const neighbour = items[(openIndex + delta + total) % total];
      const img = new Image();
      img.src = neighbour.src;
    }
  }, [openIndex, total]);

  /* Zoom is a per-visit view state: closing the lightbox always resets
     it, so reopening never lands on a cropped/oversized image with
     unexpected internal scrolling. */
  React.useEffect(() => {
    if (openIndex === null) setZoomed(false);
  }, [openIndex]);

  React.useEffect(() => {
    if (openIndex === null) return;
    lastOpenIndex.current = openIndex;

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
        setOpenIndex(null);
        return;
      }
      /* RTL reading order: ArrowRight steps back, ArrowLeft steps forward. */
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(-1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(1);
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
      const back = lastOpenIndex.current;
      if (back !== null) triggerRefs.current[back]?.focus();
    };
  }, [openIndex, go]);

  if (total === 0) {
    /* No images anywhere — render cards without thumbnails. */
    return (
      <div className="flex flex-wrap w-full gap-2">
        {certifications.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 22, x: i % 2 === 0 ? 14 : -14 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 * i }}
          >
            <CertCard item={item} onOpen={null} />
          </motion.div>
        ))}
      </div>
    );
  }

  const current = openIndex !== null ? items[openIndex] : null;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? null;
    const dx = endX === null ? 0 : endX - touchStartX.current;
    touchStartX.current = null;
    /* RTL carousel: next sits on the visual left → drag right = next. */
    if (dx > SWIPE_THRESHOLD) go(1);
    else if (dx < -SWIPE_THRESHOLD) go(-1);
  };

  return (
    <>
      <div className="flex flex-wrap w-full gap-2">
        {certifications.map((item, i) => {
          const galleryIndex = items.findIndex(
            (g) => g.src === item.image
          );
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22, x: i % 2 === 0 ? 14 : -14 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 * i }}
            >
              <CertCard
                item={item}
                onOpen={
                  galleryIndex >= 0 ? () => setOpenIndex(galleryIndex) : null
                }
                triggerRef={(el) => {
                  if (galleryIndex >= 0) triggerRefs.current[galleryIndex] = el;
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Portal to <body>: the overlay must be positioned against the
          VIEWPORT. Rendered in-place it would inherit the section's
          .depth-region `perspective` as its fixed-position containing
          block — pushing the dialog/close/prev/next off the real viewport
          corners (mis-sized previews, hidden close button, controls out
          of reach on short screens). Rendered conditionally (AnimatePresence
          cannot wrap a portal object — it would crash on open). */}
      {current
        ? createPortal(
            <div
              key="lightbox"
              ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={current.alt}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm [overscroll-behavior:contain]"
                onClick={() => setOpenIndex(null)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {/* Close — dark glass keeps it equally visible over the dark
                    backdrop AND over a bright/white image or panel corner. */}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  aria-label={t("lb.close")}
                  className="absolute end-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Prev (visual right in RTL) */}
                {total > 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(-1);
                    }}
                    aria-label={t("lb.prev")}
                    className="absolute start-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:start-4"
                  >
                    <ChevronRight className="h-6 w-6 ltr:rotate-180" aria-hidden="true" />
                  </button>
                ) : null}

                {/* Next (visual left in RTL) */}
                {total > 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      go(1);
                    }}
                    aria-label={t("lb.next")}
                    className="absolute end-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:end-4"
                  >
                    <ChevronLeft className="h-6 w-6 ltr:rotate-180" aria-hidden="true" />
                  </button>
                ) : null}

                <figure
                  className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-xl bg-white p-2 shadow-2xl [overscroll-behavior:contain] sm:p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                  >
                    <motion.img
                      key={current.src}
                      src={current.src}
                      alt={current.alt}
                      initial={{ opacity: 0, x: direction === 1 ? -56 : 56 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction === 1 ? 56 : -56 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomed((z) => !z);
                      }}
                      className={`mx-auto h-auto w-auto rounded-lg ${
                        zoomed
                          ? "max-w-none cursor-zoom-out"
                          : "max-h-[80vh] max-w-full cursor-zoom-in object-contain"
                      }`}
                      draggable={false}
                    />
                  </AnimatePresence>
                  <figcaption className="flex flex-wrap items-center justify-center gap-2 py-2 text-center text-sm text-zinc-600">
                    <span>{current.alt}</span>
                    {total > 1 ? (
                      <span
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500"
                        aria-live="polite"
                      >
                        {lang === "fa" ? faDigits((openIndex ?? 0) + 1) : (openIndex ?? 0) + 1}{" "}
                        {t("lb.of")}{" "}
                        {lang === "fa" ? faDigits(total) : total}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

/* Card markup moved here from section.tsx so the whole gallery (grid +
   shared lightbox) lives in one client component. The card flips open
   (Skills interaction family) to show the certificate image; the image
   itself lives full-size inside the shared lightbox. */
function CertCard({
  item,
  onOpen,
  triggerRef,
}: {
  item: Certification;
  onOpen: (() => void) | null;
  triggerRef?: (el: HTMLButtonElement | null) => void;
}) {
  const { lang, t, pick } = useLang();
  const [flipped, setFlipped] = React.useState(false);
  const title = pick(item.title, item.titleEn);
  const tags = lang === "en" ? (item.tagsEn ?? item.tags) : item.tags;
  const canFlip = Boolean(item.image && onOpen);

  /* Opens the fullscreen lightbox; the card returns to its front face
     while the dialog is open so focus return lands on a visible card. */
  const openFullscreen = () => {
    setFlipped(false);
    onOpen?.();
  };

  const front = (
    <div className="flip-face flex h-full w-full flex-col rounded-xl border border-border/50 bg-card shadow-sm transition-shadow">
      <div className="space-y-1.5 p-6 flex flex-col gap-2">
        <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">{item.issuer}</p>
          {item.date ? (
            <div className="inline-flex items-center border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs font-normal rounded-sm">
              {pick(item.date, item.dateEn)}
            </div>
          ) : null}
          {item.credentialId ? (
            <span className="text-xs text-muted-foreground">
              {t("cert.idLabel")}{item.credentialId}
            </span>
          ) : null}
        </div>
      </div>
      <div className="p-6 pt-0 space-y-3 min-h-0 flex-1 overflow-hidden">
        {/* In-site preview trigger — the certificate image itself is never
            rendered on the front; it is revealed by flipping the card open
            and shown full-size inside the shared lightbox. The primary
            button opens the lightbox directly (original behavior kept). */}
        {item.image && onOpen ? (
          <div className="space-y-1.5">
            <Button
              ref={triggerRef}
              type="button"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openFullscreen();
              }}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-fit"
              aria-label={`${t("cert.previewOf")} ${title}`}
              aria-haspopup="dialog"
              title={t("cert.previewOf")}
            >
              <ImageIcon className="h-4 w-4 me-2" aria-hidden="true" />
              {t("cert.viewImage")}
            </Button>
            <p className="text-xs text-muted-foreground/80">
              {t("cert.imageHint")}
            </p>
          </div>
        ) : null}
        {item.description ? (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {pick(item.description, item.descriptionEn)}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );

  if (!canFlip) {
    /* No image anywhere — keep the original static card (no flip). */
    return (
      <TiltCard className="w-full max-w-[450px]" lightClassName="rounded-lg" glow>
        <Card className="w-full transition-all duration-200 bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30">
          {front}
        </Card>
      </TiltCard>
    );
  }

  return (
    <TiltCard
      className="h-[320px] w-full max-w-[450px]"
      contentLift={0}
      maxTilt={4.5}
      lightClassName="rounded-xl"
      glow
    >
      <FlipCard
        flipped={flipped}
        onToggle={() => setFlipped((f) => !f)}
        label={`${title} — ${t("cert.ariaSuffix")}`}
      >
        {front}

        {/* BACK — the certificate image, prominent and aspect-true, with
            an elegant path to the fullscreen lightbox and back out. The
            accent ring is the same PURE brand green as the education
            flip family — one shared treatment, both themes. */}
        <div className="flip-face flip-face-back flex h-full w-full flex-col rounded-xl border border-primary bg-card p-3 shadow-lg">
          <div className="min-h-0 flex-1 rounded-lg bg-white p-1.5 shadow-inner">
            <img
              src={withBase(item.image)}
              alt={`${t("cert.alt")} ${title} — ${item.issuer}`}
              onClick={(e) => {
                e.stopPropagation();
                openFullscreen();
              }}
              className="h-full w-full cursor-zoom-in object-contain"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
          <div className="flex shrink-0 items-center justify-center gap-2 pt-2.5">
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openFullscreen();
              }}
              onKeyDown={(e) => e.stopPropagation()}
              aria-haspopup="dialog"
              aria-label={`${t("cert.viewImage")} — ${title}`}
            >
              <Maximize2 className="h-4 w-4 me-2" aria-hidden="true" />
              {t("cert.viewImage")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={`${t("flip.back")} — ${title}`}
            >
              <RotateCcw className="h-4 w-4 me-2 rtl:rotate-0" aria-hidden="true" />
              {t("flip.back")}
            </Button>
          </div>
        </div>
      </FlipCard>
    </TiltCard>
  );
}
