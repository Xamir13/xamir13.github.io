"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ====================================================================
   DEPTH REGION — section-level receding visual plane

   The wrapper tracks the pointer across a whole section while ONLY a
   decorative backdrop layer ([the `backdrop` node]) moves — content,
   cards, buttons and text are never transformed, so readability and
   interactivity stay untouched.

   The plane is "pushed away" from the viewer, raphaelonana-style:
     • small counter-parallax translation (the plane drifts away from
       the cursor, which reads as true spatial depth),
     • a barely-there rotateX/rotateY tilt (the corner under the
       cursor recedes),
     • a gentle scale-down (camera dollies past the plane),
     • a slight translateZ push into the perspective scene.

   Engineering:
   • ONE rAF loop per hovered region, lerped (0.09) for silky motion;
     the loop self-stops once the plane settles back home.
   • Writes only `transform` (compositor-only) straight to the backdrop
     element — zero React re-renders, zero layout work.
   • Mouse pointers only; touch devices and prefers-reduced-motion
     never activate it (the plane simply rests, fully static).
   ==================================================================== */

type DepthRegionProps = {
  children: React.ReactNode;
  className?: string;
  /** Decorative node rendered inside the receding plane (glow, grid, image…). */
  backdrop?: React.ReactNode;
  /** Extra classes for the plane element — controls its overscan inset. */
  backdropClassName?: string;
  /** Max counter-parallax drift in px (default 14). */
  shift?: number;
  /** Recede amount: scale goes from 1 → 1-recede while hovered (default 0.03). */
  recede?: number;
  /** Max tilt in degrees (default 2.2 — deliberately restrained). */
  tilt?: number;
  /** translateZ push in px while hovered (default −24). */
  push?: number;
  /** Perspective of the 3D scene in px (default 1200). */
  perspective?: number;
};

const LERP = 0.09;

export function DepthRegion({
  children,
  className,
  backdrop,
  backdropClassName,
  shift = 14,
  recede = 0.03,
  tilt = 2.2,
  push = -24,
  perspective = 1200,
}: DepthRegionProps) {
  const subjectRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef(0);
  const current = React.useRef({ x: 0, y: 0, s: 0 });
  const target = React.useRef({ x: 0, y: 0, s: 0 });
  const enabledRef = React.useRef(false);

  React.useEffect(() => {
    enabledRef.current = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const apply = () => {
    const el = subjectRef.current;
    const c = current.current;
    const t = target.current;

    c.x += (t.x - c.x) * LERP;
    c.y += (t.y - c.y) * LERP;
    c.s += (t.s - c.s) * LERP;

    if (el) {
      const k = c.s;
      const px = (-c.x * shift * k).toFixed(2);
      const py = (-c.y * shift * 0.72 * k).toFixed(2);
      const pz = (push * k).toFixed(2);
      const rx = (c.y * tilt * k).toFixed(3);
      const ry = (-c.x * tilt * k).toFixed(3);
      const sc = (1 - recede * k).toFixed(4);
      el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`;
      if (k > 0.001 && !el.style.willChange) el.style.willChange = "transform";
    }

    const settled =
      Math.abs(t.x - current.current.x) < 0.001 &&
      Math.abs(t.y - current.current.y) < 0.001 &&
      Math.abs(t.s - current.current.s) < 0.001;

    if (settled) {
      if (t.s === 0 && el) {
        /* fully back home — clear inline styles, drop the compositor hint */
        el.style.transform = "";
        el.style.willChange = "";
      }
      rafRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(apply);
  };

  const startLoop = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!enabledRef.current || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    target.current.x = Math.max(
      -1,
      Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1)
    );
    target.current.y = Math.max(
      -1,
      Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1)
    );
    target.current.s = 1;
    startLoop();
  };

  const onPointerLeave = () => {
    target.current.x = 0;
    target.current.y = 0;
    target.current.s = 0;
    startLoop();
  };

  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      className={cn("relative depth-region", className)}
      style={{ perspective: `${perspective}px` }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* The receding plane — decorative only, never intercepts pointers. */}
      <div
        ref={subjectRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-x-6 -inset-y-8 z-0",
          "md:-inset-x-10 md:-inset-y-12",
          backdropClassName
        )}
      >
        {backdrop}
      </div>
      {/* Content sits ABOVE the plane and is never transformed. */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
