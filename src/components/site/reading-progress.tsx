"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.3,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        className="h-full w-full origin-right rounded-full bg-gradient-to-l from-primary via-primary to-primary/50 shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
        style={{ scaleX }}
      />
    </div>
  );
}
