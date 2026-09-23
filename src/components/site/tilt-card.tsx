"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ====================================================================
   TILT CARD — premium mouse-tracked 3D depth surface

   The card behaves like a flexible 3D surface whose depth reacts to
   the cursor position (the Dan-Munson-style "region under the cursor
   comes forward" feel):

     • The area underneath the pointer is pulled TOWARD the viewer —
       the card pivots so the cursor side lifts (rotateX/rotateY are
       derived with the correct CSS 3D sign so the hovered edge truly
       gains +Z), with a gentle overall translateZ + scale lift.
     • Regions farther from the cursor recede naturally through the
       perspective (geometry, not a fake filter).
     • A cursor-following radial light (CSS vars --mx/--my, zero JS
       per-frame cost after the transform write) reinforces the
       localized depth and doubles as the "light source" cue.
     • With `layers`, the content itself sits on its own translateZ
       plane that eases forward slightly more than the surface —
       subtle layered parallax without flattening (preserve-3d).

   Engineering (identical discipline to DepthRegion / Parallax3D):
   • ONE self-stopping rAF loop per hovered card, lerped (0.14) for
     fluid motion; writes only `transform` + two CSS vars — zero
     React re-renders, zero layout reads inside the loop.
   • getBoundingClientRect() is cached on pointerenter — never called
     in pointermove (no layout thrashing).
   • Mouse pointers only (`pointerType !== "mouse"` returns early) —
     touch devices keep stable cards; prefers-reduced-motion disables
     the whole system (static card).
   • Listeners + loop are cleaned up on unmount.
   ==================================================================== */

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees (default 5 — deliberately restrained). */
  maxTilt?: number;
  /** translateZ lift while hovered in px (default 10). */
  liftZ?: number;
  /** Extra scale while hovered (default 0.012 → scale 1.012). */
  scale?: number;
  /** Extra upward shift in px while hovered (default 2). */
  liftY?: number;
  /** Extra translateZ for the content plane while hovered (default 8; 0 disables). */
  contentLift?: number;
  /** Render the cursor-following light layer (default true). */
  light?: boolean;
  /** Render the green atmospheric halo that fades in on hover
      (skills-family cards + the six content card types). */
  glow?: boolean;
  /** Render the cursor-reactive 1px border light — a hairline brand-green
      ring whose brightest arc follows the cursor (reads --mx/--my, so it
      costs zero extra JS). Hover-capable pointers only, hidden under
      reduced motion. */
  borderLight?: boolean;
  /** Radius class for the light layer — should match the card radius. */
  lightClassName?: string;
  /** Perspective of the 3D scene in px (default 1000). */
  perspective?: number;
};

const LERP = 0.14;

export function TiltCard({
  children,
  className,
  maxTilt = 5,
  liftZ = 10,
  scale = 0.012,
  liftY = 2,
  contentLift = 8,
  light = true,
  glow = false,
  borderLight = false,
  lightClassName = "rounded-lg",
  perspective = 1000,
}: TiltCardProps) {
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const tiltRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef(0);
  const rectRef = React.useRef<DOMRect | null>(null);
  const current = React.useRef({ x: 0, y: 0, z: 0, c: 0 });
  const target = React.useRef({ x: 0, y: 0, z: 0, c: 0 });
  const enabledRef = React.useRef(false);

  React.useEffect(() => {
    enabledRef.current = !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const apply = () => {
    const el = tiltRef.current;
    const c = current.current;
    const t = target.current;

    c.x += (t.x - c.x) * LERP;
    c.y += (t.y - c.y) * LERP;
    c.z += (t.z - c.z) * LERP;
    c.c += (t.c - c.c) * LERP;

    if (el) {
      const k = c.z / (liftZ || 1); /* 0 at rest → 1 fully hovered */
      const sc = 1 + scale * k;
      /* Sign convention: rotateX(ny·tilt) / rotateY(−nx·tilt) makes the
         region UNDER the cursor move toward the viewer (+Z). */
      el.style.transform =
        k < 0.0005 && t.z === 0
          ? "" /* fully home — clear inline transform */
          : `translate3d(0px, ${(-liftY * k).toFixed(2)}px, ${c.z.toFixed(
              2
            )}px) rotateX(${(c.y * maxTilt).toFixed(3)}deg) rotateY(${(
              -c.x *
              maxTilt
            ).toFixed(3)}deg) scale(${sc.toFixed(4)})`;
      el.style.setProperty("--mx", `${(50 + c.x * 50).toFixed(2)}%`);
      el.style.setProperty("--my", `${(50 + c.y * 50).toFixed(2)}%`);
      el.style.setProperty("--tilt-content-z", `${c.c.toFixed(2)}px`);
      /* Normalised pointer for the INNER depth layers ([data-il] reads
         these and multiplies by its own --il-depth). Same lerped value
         the tilt uses → perfectly synchronised parallax, 0 extra cost. */
      el.style.setProperty("--par-x", c.x.toFixed(3));
      el.style.setProperty("--par-y", c.y.toFixed(3));
      if (el.style.willChange !== "transform" && (t.z !== 0 || k > 0.001)) {
        el.style.willChange = "transform";
      }
    }

    const settled =
      Math.abs(t.x - c.x) < 0.001 &&
      Math.abs(t.y - c.y) < 0.001 &&
      Math.abs(t.z - c.z) < 0.01 &&
      Math.abs(t.c - c.c) < 0.01;

    if (settled) {
      if (t.z === 0 && el) {
        el.style.transform = "";
        el.style.willChange = "";
        el.style.setProperty("--tilt-content-z", "0px");
        /* Park the parallax + light coordinates exactly at rest so no
           stale offset survives after the cursor leaves. */
        el.style.setProperty("--par-x", "0");
        el.style.setProperty("--par-y", "0");
        el.style.setProperty("--mx", "50%");
        el.style.setProperty("--my", "50%");
      }
      rafRef.current = 0;
      return;
    }
    rafRef.current = requestAnimationFrame(apply);
  };

  const startLoop = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
  };

  const onPointerEnter = (e: React.PointerEvent) => {
    /* Cache the rect once per hover — pointermove never touches layout. */
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!enabledRef.current || e.pointerType !== "mouse") return;
    const rect = rectRef.current ?? e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = Math.max(
      -1,
      Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1)
    );
    const ny = Math.max(
      -1,
      Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1)
    );
    target.current.x = nx;
    target.current.y = ny;
    target.current.z = liftZ;
    target.current.c = contentLift;
    startLoop();
  };

  const onPointerLeave = () => {
    rectRef.current = null;
    target.current.x = 0;
    target.current.y = 0;
    target.current.z = 0;
    target.current.c = 0;
    startLoop();
  };

  React.useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={sceneRef}
      className={cn("tilt-scene relative", className)}
      style={{ perspective: `${perspective}px` }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        ref={tiltRef}
        className="tilt-card relative h-full w-full"
        style={contentLift > 0 ? { transformStyle: "preserve-3d" } : undefined}
      >
        {/* Green atmospheric halo — sits BELOW the card surface (the
            content plane above carries z-index 1), follows the exact
            rounded shape, tilts with the card, pure opacity animation. */}
        {glow ? (
          <span
            aria-hidden="true"
            className={cn("glow-halo pointer-events-none absolute inset-0", lightClassName)}
          />
        ) : null}
        <div
          className="relative z-[1] h-full w-full"
          style={
            contentLift > 0
              ? { transform: "translateZ(var(--tilt-content-z, 0px))" }
              : undefined
          }
        >
          {children}
        </div>
        {/* Cursor-reactive hairline border light (masked to a 1px ring,
            brightest arc tracks --mx/--my). Sits above the surface but
            below the broad tilt-light, pointer-transparent. */}
        {borderLight ? (
          <span
            aria-hidden="true"
            className={cn("il-border pointer-events-none absolute inset-0 z-10", lightClassName)}
          />
        ) : null}
        {light ? (
          <span
            aria-hidden="true"
            className={cn(
              "tilt-light pointer-events-none absolute inset-0 z-20",
              lightClassName
            )}
          />
        ) : null}
      </div>
    </div>
  );
}
