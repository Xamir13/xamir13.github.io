"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ====================================================================
   PARALLAX 3D — mouse-driven depth for selected hero elements

   A wrapper tracks the pointer and exposes normalised coordinates
   through CSS custom properties (no React re-renders):

     --par-x / --par-y   → -1 … 1 pointer position inside the frame
     --tilt-x / --tilt-y → ready-to-use rotateX/rotateY values (deg)

   Descendant layers then move at different speeds purely in CSS:

     <div style={{ transform: "translate3d(calc(var(--par-x) * 10px), calc(var(--par-y) * 8px), 0)" }} />
     <div style={{ transform: "rotateX(var(--tilt-x)) rotateY(var(--tilt-y))" }} />

   Performance: one rAF loop while the pointer is inside the frame
   (interpolated for extra smoothness), stopped once the frame settles
   back home. Desktop-only: on touch/reduced-motion the variables stay
   at 0 and all layers sit at rest — zero JS motion, graceful layout.
   ==================================================================== */

type Parallax3DProps = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees (default 6 — deliberately restrained). */
  maxTilt?: number;
  /** Perspective for the 3D scene (default 900px). */
  perspective?: number;
};

export function Parallax3D({
  children,
  className,
  maxTilt = 6,
  perspective = 900,
}: Parallax3DProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef(0);
  const target = React.useRef({ x: 0, y: 0 });
  const current = React.useRef({ x: 0, y: 0 });
  const enabledRef = React.useRef(false);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Pointer type is trusted per-event (mouse only) — this works on
       real desktops, hybrid laptops, and ignores touch scrolling. */
    enabledRef.current = !reduced;
  }, []);

  function apply() {
    const frame = frameRef.current;
    if (!frame) return;
    /* Lerp current values toward target for silky movement. */
    current.current.x += (target.current.x - current.current.x) * 0.12;
    current.current.y += (target.current.y - current.current.y) * 0.12;

    const { x, y } = current.current;
    frame.style.setProperty("--par-x", x.toFixed(4));
    frame.style.setProperty("--par-y", y.toFixed(4));
    frame.style.setProperty("--tilt-x", (-y * maxTilt).toFixed(3) + "deg");
    frame.style.setProperty("--tilt-y", (x * maxTilt).toFixed(3) + "deg");

    const settled =
      Math.abs(target.current.x - current.current.x) < 0.001 &&
      Math.abs(target.current.y - current.current.y) < 0.001;
    if (settled && target.current.x === 0 && target.current.y === 0) {
      rafRef.current = 0; /* fully back home — stop the loop */
      return;
    }
    rafRef.current = requestAnimationFrame(apply);
  }

  function startLoop() {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
  }

  function onPointerMove(e: React.PointerEvent) {
    const frame = frameRef.current;
    if (!frame || !enabledRef.current || e.pointerType !== "mouse") return;
    const rect = frame.getBoundingClientRect();
    target.current.x = Math.max(
      -1,
      Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1)
    );
    target.current.y = Math.max(
      -1,
      Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1)
    );
    startLoop();
  }

  function onPointerLeave() {
    target.current.x = 0;
    target.current.y = 0;
    startLoop();
  }

  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={frameRef}
      className={cn("relative", className)}
      style={{ perspective: `${perspective}px` }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
