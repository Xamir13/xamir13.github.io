"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ====================================================================
   MAGNETIC — premium magnetic-hover wrapper (desktop, fine pointers)

   The wrapped element eases toward the cursor while it is inside the
   wrapper's proximity area and springs back on leave. Any descendant
   marked with `data-magnetic-child` (e.g. the icon) follows with a
   stronger factor for layered depth.

   Performance notes:
   • Direct transform writes on pointermove (fires per animation frame
     anyway) — no React state, no rAF churn, no re-renders.
   • The spring-back on leave is a single CSS transition using the
     shared --ease-spring token; elements always return home.
   • Displacement is deliberately small (≤ ~8px) to stay premium.
   ==================================================================== */

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  /** 0–1, how strongly the wrapper chases the cursor (default 0.3). */
  strength?: number;
  /** Extra pull applied to [data-magnetic-child] descendants. */
  childStrength?: number;
  /** Radius added around the element that still attracts (px). */
  radius?: number;
  as?: "div" | "span";
};

export function Magnetic({
  children,
  className,
  strength = 0.3,
  childStrength = 0.6,
  radius = 14,
  as = "div",
}: MagneticProps) {
  const wrapRef = React.useRef<HTMLDivElement | HTMLSpanElement>(null);

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      /* Clamp inside an enlarged proximity circle so the pull feels
         magnetic rather than 1:1 with the pointer. */
      const max = (rect.width / 2 + radius) * 0.85;
      const cx = Math.max(-max, Math.min(max, dx));
      const cy = Math.max(-max, Math.min(max, dy));

      wrap.style.transition = "none";
      wrap.style.transform = `translate3d(${cx * strength}px, ${cy * strength}px, 0)`;

      const child = wrap.querySelector<HTMLElement>("[data-magnetic-child]");
      if (child) {
        child.style.transition = "none";
        child.style.transform = `translate3d(${cx * childStrength}px, ${cy * childStrength}px, 0)`;
      }
    },
    [strength, childStrength, radius]
  );

  const onPointerLeave = React.useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    /* Spring back — smooth, physical, always returns home. */
    wrap.style.transition = "transform 560ms var(--ease-spring)";
    wrap.style.transform = "translate3d(0, 0, 0)";
    const child = wrap.querySelector<HTMLElement>("[data-magnetic-child]");
    if (child) {
      child.style.transition = "transform 620ms var(--ease-spring)";
      child.style.transform = "translate3d(0, 0, 0)";
    }
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={wrapRef as React.Ref<HTMLDivElement & HTMLSpanElement>}
      className={cn("inline-flex will-change-transform", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </Tag>
  );
}
