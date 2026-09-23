"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

import { cn } from "@/lib/utils";
import { withBase } from "@/lib/paths";
import { useLang } from "@/lib/lang";
import {
  profile,
  socials,
  typedPhrases,
  typedPhrasesEn,
} from "@/lib/site-data";
import { Button } from "@/components/site/primitives";
import { Magnetic } from "@/components/site/magnetic";
import { Parallax3D } from "@/components/site/parallax-3d";
import { DepthRegion } from "@/components/site/depth-region";
import { TiltCard } from "@/components/site/tilt-card";

/* ====================================================================
   TYPEWRITER (homepage only — Hero is rendered exclusively by /)
   Natural typing: per-character delay varies with a small jitter,
   longer beat at punctuation, real pause when a phrase completes,
   faster deletion. RTL text assembles naturally since characters are
   appended to the same string node. min-height reserves the row so
   nothing jumps. Reduced motion → calm instant rotation, no typing.
   ==================================================================== */

const TYPE_BASE_MS = 62;
const TYPE_JITTER_MS = 46;
const DELETE_MS = 26;
const HOLD_FULL_MS = 2100;
const HOLD_EMPTY_MS = 420;

function TypedPhrases({ phrases }: { phrases: string[] }) {
  const reduced = usePrefersReducedMotion();
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [length, setLength] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  /* Language switch → start the new phrase list cleanly (render-adjust
     pattern, no remount, no stale index against a shorter array). */
  const [prevPhrases, setPrevPhrases] = React.useState(phrases);
  if (prevPhrases !== phrases) {
    setPrevPhrases(phrases);
    setPhraseIndex(0);
    setLength(0);
    setDeleting(false);
  }

  React.useEffect(() => {
    if (reduced) {
      /* Non-animated fallback: rotate instantly, no caret motion. */
      const timer = setInterval(
        () => setPhraseIndex((i) => (i + 1) % phrases.length),
        4000
      );
      return () => clearInterval(timer);
    }

    const phrase = phrases[phraseIndex] ?? "";
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && length < phrase.length) {
      const char = phrase[length];
      /* Natural rhythm: slightly longer beat after punctuation/space. */
      const extra = /[،.;:！?!\s]/.test(char ?? "") ? 90 : 0;
      timer = setTimeout(
        () => setLength((l) => l + 1),
        TYPE_BASE_MS + Math.random() * TYPE_JITTER_MS + extra
      );
    } else if (!deleting && length === phrase.length) {
      timer = setTimeout(() => setDeleting(true), HOLD_FULL_MS);
    } else if (deleting && length > 0) {
      timer = setTimeout(() => setLength((l) => l - 1), DELETE_MS);
    } else {
      timer = setTimeout(() => {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }, HOLD_EMPTY_MS);
    }
    return () => clearTimeout(timer);
  }, [length, deleting, phraseIndex, reduced, phrases]);

  const full = phrases[phraseIndex] ?? "";
  const text = reduced ? full : full.slice(0, length);

  return (
    <div
      className="mt-6 min-h-[3.5rem] w-full max-w-2xl md:mt-8 md:min-h-[3.5rem]"
      aria-live="polite"
      aria-atomic="true"
    >
      <p
        className={cn(
          "text-lg font-medium md:text-xl lg:text-2xl",
          "bg-gradient-to-l from-foreground/90 via-foreground/80 to-primary bg-clip-text text-transparent",
          "drop-shadow-[0_0_20px_hsl(var(--primary)/0.25)]"
        )}
      >
        {text}
        {!reduced && <span className="type-caret" aria-hidden="true" />}
      </p>
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* ====================================================================
   HERO
   The cover photograph is a true DEPTH PLANE (DepthRegion): as the
   pointer travels across the hero, the whole photographic layer is
   gently pushed away — counter-drift + micro-tilt + camera dolly —
   while the frosted overlay, the text and every control stay perfectly
   still. The avatar keeps its own finer-grained Parallax3D scene.
   ==================================================================== */

export function Hero() {
  const { lang, t, pick } = useLang();
  const phrases = lang === "en" ? typedPhrasesEn : typedPhrases;

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden">
      <DepthRegion
        className="w-full"
        shift={12}
        recede={0.028}
        tilt={1.5}
        push={-22}
        backdropClassName="-inset-10"
        backdrop={
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${withBase(profile.heroCover)})` }}
          />
        }
      >
        <div className="relative flex min-h-[85vh] w-full flex-col items-center justify-center">
          <div
            className={cn(
              "absolute inset-0 z-0",
              "bg-background/80 backdrop-blur-sm",
              "dark:bg-black/70"
            )}
            aria-hidden="true"
          />
          <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 py-16 md:px-8 md:py-24">
            <div className="flex w-full max-w-4xl flex-col items-center text-center">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {t("hero.hi")}{" "}
                <span className="text-primary">
                  {pick(profile.username, profile.usernameEn)}
                </span>
                {t("hero.mid")}{" "}
                <span className="relative inline-block">
                  {pick(profile.role, profile.roleEn)}
                  <motion.span
                    className={cn(
                      "absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-primary",
                      lang === "fa" ? "origin-right" : "origin-left"
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ boxShadow: "0 0 12px hsl(var(--primary))" }}
                    aria-hidden="true"
                  />
                </span>
                .
              </h1>
              <TypedPhrases phrases={phrases} />

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="#contact" className="inline-flex">
                  {/* Premium micro-tilt on the primary CTA (restrained: 4° max). */}
                  <TiltCard
                    className="inline-block"
                    maxTilt={4}
                    liftZ={8}
                    scale={0.02}
                    contentLift={6}
                    lightClassName="rounded-md"
                  >
                    <Button size="lg" className="gap-2 shadow-lg">
                      <Handshake className="h-5 w-5" />
                      {t("hero.cta")}
                    </Button>
                  </TiltCard>
                </Link>
              </div>
            </div>

            {/* ---------- Avatar: parallax depth + camera-dolly zoom ---------- */}
            <div className="mt-16 flex flex-col items-center gap-6 md:mt-20">
              <Parallax3D maxTilt={7} perspective={900}>
                {/* layer 1 — soft green aura drifting behind the portrait */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{
                    transform:
                      "translate3d(calc(var(--par-x, 0) * 16px), calc(var(--par-y, 0) * 14px), 0)",
                  }}
                >
                  <span className="block h-32 w-32 rounded-full bg-primary/25 blur-2xl md:h-36 md:w-36" />
                </div>

                {/* layer 2 — the portrait itself (tilts as one object) */}
                <div
                  className="depth-frame relative rounded-full"
                  style={{
                    transform:
                      "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* receding ring — counter-motion sells the depth */}
                  <span
                    aria-hidden="true"
                    className="depth-ring depth-ring-recede absolute -inset-2 rounded-full border border-primary/35"
                  />
                  <span
                    aria-hidden="true"
                    className="depth-ring depth-glow absolute -inset-2 rounded-full opacity-0 shadow-[0_0_36px_hsl(var(--primary)/0.45)]"
                  />
                  <span className="relative flex h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-border shadow-xl md:h-36 md:w-36">
                    <img
                      src={withBase(profile.avatarImage)}
                      alt={`${t("hero.portrait")} ${pick(profile.fullName, profile.fullNameEn)}`}
                      className="depth-img h-full w-full object-cover object-top"
                    />
                  </span>
                </div>
              </Parallax3D>

              {/* ---------- Socials: glass panel + magnetic links ---------- */}
              <ul
                className="glass-panel flex flex-wrap items-center justify-center gap-1.5 rounded-2xl p-2"
                aria-label={t("hero.socialsAria")}
              >
                {socials.map(({ id, name, nameEn, url, icon: Icon }) => (
                  <li key={id}>
                    <Magnetic as="span" strength={0.38} childStrength={0.5}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={cn(
                          "flex items-center justify-center rounded-xl p-2.5",
                          "text-muted-foreground hover:text-primary",
                          "border border-transparent transition-colors duration-200",
                          "hover:border-primary/25 hover:bg-primary/5",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        )}
                        aria-label={pick(name, nameEn)}
                      >
                        <span data-magnetic-child className="inline-flex">
                          <Icon color="currentColor" size={26} strokeWidth={1.6} />
                        </span>
                      </a>
                    </Magnetic>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DepthRegion>

      <div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-muted-foreground"
        aria-hidden="true"
      >
        <video
          className="h-12 w-12 object-contain motion-reduce:hidden"
          width={48}
          height={48}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src={withBase("/media/scroll_down_animation.webm")} type="video/webm" />
        </video>
      </div>
    </section>
  );
}
