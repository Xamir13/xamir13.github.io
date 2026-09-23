"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Section rail themes (exact reference mapping)                       */
/* ------------------------------------------------------------------ */

export const sectionThemes = {
  about: {
    line: "bg-gradient-to-b from-primary/30 via-primary to-primary/30 dark:from-primary/40 dark:via-primary dark:to-primary/40",
    glow: "bg-primary/10 dark:bg-primary/20 shadow-primary/20",
    icon: "text-primary",
    packet: "bg-primary/70 dark:bg-primary/80",
    titleCap: "text-primary",
    titleLight: "text-light-primary",
  },
  experience: {
    line: "bg-gradient-to-b from-amber-500/30 via-amber-500 to-amber-500/30 dark:from-amber-400/40 dark:via-amber-400 dark:to-amber-400/40",
    glow: "bg-amber-500/10 dark:bg-amber-500/20 shadow-amber-500/20",
    icon: "text-amber-600 dark:text-amber-400",
    packet: "bg-amber-500/75 dark:bg-amber-400/80",
    titleCap: "text-amber-600 dark:text-amber-400",
    titleLight: "text-amber-700 dark:text-amber-300",
  },
  primary: {
    line: "bg-gradient-to-b from-violet-500/30 via-violet-500 to-violet-500/30 dark:from-violet-400/40 dark:via-violet-400 dark:to-violet-400/40",
    glow: "bg-violet-500/10 dark:bg-violet-500/20 shadow-violet-500/20",
    icon: "text-violet-600 dark:text-violet-400",
    packet: "bg-violet-500/75 dark:bg-violet-400/80",
    titleCap: "text-violet-600 dark:text-violet-400",
    titleLight: "text-violet-700 dark:text-violet-300",
  },
  work: {
    line: "bg-gradient-to-b from-teal-500/30 via-teal-500 to-teal-500/30 dark:from-teal-400/40 dark:via-teal-400 dark:to-teal-400/40",
    glow: "bg-teal-500/10 dark:bg-teal-500/20 shadow-teal-500/20",
    icon: "text-teal-600 dark:text-teal-400",
    packet: "bg-teal-500/75 dark:bg-teal-400/80",
    titleCap: "text-teal-600 dark:text-teal-400",
    titleLight: "text-teal-700 dark:text-teal-300",
  },
  contact: {
    line: "bg-gradient-to-b from-sky-500/30 via-sky-500 to-sky-500/30 dark:from-sky-400/40 dark:via-sky-400 dark:to-sky-400/40",
    glow: "bg-sky-500/10 dark:bg-sky-500/20 shadow-sky-500/20",
    icon: "text-sky-600 dark:text-sky-400",
    packet: "bg-sky-500/75 dark:bg-sky-400/80",
    titleCap: "text-sky-600 dark:text-sky-400",
    titleLight: "text-sky-700 dark:text-sky-300",
  },
} as const;

export type SectionThemeName = keyof typeof sectionThemes;

/* ------------------------------------------------------------------ */
/* Scroll-driven vertical indicator (exact reference behavior)         */
/* ------------------------------------------------------------------ */

export function SectionIndicator({
  icon: Icon,
  iconSize = 28,
  theme,
}: {
  icon: LucideIcon;
  iconSize?: number;
  theme: SectionThemeName;
}) {
  const reducedMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 62%"],
  });
  const spring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.25,
  });
  const y = useTransform(spring, [0, 0.5, 1], [3, -5, 3]);
  const scale = useTransform(spring, [0, 0.5, 1], [0.97, 1.06, 0.97]);
  const glowOpacity = useTransform(spring, [0, 0.35, 1], [0.2, 0.9, 0.3]);
  const t = sectionThemes[theme];

  return (
    <div
      ref={ref}
      className="relative w-10 md:w-14 shrink-0 self-stretch min-h-0"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          className="relative flex items-center justify-center shrink-0"
          style={reducedMotion ? undefined : { y, scale }}
          transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.5 }}
        >
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full scale-125 -z-10",
              t.glow
            )}
            style={reducedMotion ? undefined : { opacity: glowOpacity }}
            animate={reducedMotion ? undefined : { scale: [1.2, 1.3, 1.2] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 2.8, ease: "easeInOut", repeat: Infinity }
            }
            aria-hidden="true"
          />
          <div className={cn("relative", t.icon)}>
            <Icon size={iconSize} />
          </div>
        </motion.div>
      </div>
      <div
        className="absolute left-1/2 top-10 md:top-14 -translate-x-1/2 bottom-0 w-1 rounded-full min-h-[2rem] bg-muted/40"
        aria-hidden="true"
      />
      <motion.div
        className={cn(
          "absolute left-1/2 top-10 md:top-14 -translate-x-1/2 bottom-0 w-1 rounded-full min-h-[2rem] origin-top overflow-hidden",
          t.line
        )}
        style={{ scaleY: spring }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 line-data-flow" />
        <div
          className={cn(
            "absolute left-1/2 top-0 h-8 w-2 -translate-x-1/2 rounded-full blur-[6px] line-data-packet",
            t.packet
          )}
        />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section title — first letter of every word accented (exact logic)   */
/* ------------------------------------------------------------------ */

export function SectionTitle({
  text,
  theme,
}: {
  text: string;
  theme: SectionThemeName;
}) {
  const t = sectionThemes[theme];
  const words = text.split(" ").map((word) => {
    const cap = word.charAt(0).toUpperCase();
    const rest = word.slice(1);
    return (
      <span key={word} className={cn(" font-bold text-lg", t.titleLight)}>
        <span className={cn("text-primary font-bold", t.titleCap)}>{cap}</span>
        {rest}
      </span>
    );
  });
  return (
    <div>
      {words.map((w, i) => (
        <span key={i}>
          {w}{" "}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared reveal variants (exact reference configs)                    */
/* ------------------------------------------------------------------ */

export const revealY = (
  y = 20,
  duration = 0.45
): { initial: Record<string, unknown>; whileInView: Record<string, unknown> } => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
});

export const MotionDiv = motion.div;
export type { Variants };
