"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ====================================================================
   FLIP CARD — the Skills & Technologies flip interaction, generalized

   The Skills section (skills-cube.tsx) flips a card open to a detail
   face and back. Certificates and Education now open the SAME way, so
   the scaffolding lives here and reuses the exact same architecture:

     • the same CSS classes (.flip-scene / .flip-inner / .flip-face /
       .flip-face-back + .is-flipped) and therefore the same 680ms
       var(--ease-out-expo) 3D transition defined in globals.css,
     • the same a11y contract: role="button", aria-pressed, Enter/Space
       toggling, visible focus ring,
     • the same layering: TiltCard (contentLift 0, flat tilt) wraps the
       flip scene so the inner preserve-3d scene stays untouched.

   The back face may contain real interactive controls (e.g. the
   certificate's fullscreen button) — those must call
   stopPropagation()/preventDefault() so they don't re-toggle the flip.
   ==================================================================== */

export function FlipCard({
  flipped,
  onToggle,
  label,
  children,
  className,
  radiusClassName = "rounded-xl",
}: {
  flipped: boolean;
  onToggle: () => void;
  /** Accessible name describing what opening the card reveals. */
  label: string;
  /** Exactly two faces: the front element, then the back element
      (the back one carries the .flip-face-back class). */
  children: React.ReactNode;
  className?: string;
  /** Radius used by the focus ring + both faces (keep them matched). */
  radiusClassName?: string;
}) {
  return (
    <div className={cn("flip-scene h-full w-full", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={label}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          "flip-inner h-full w-full outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          radiusClassName,
          flipped && "is-flipped"
        )}
      >
        {children}
      </div>
    </div>
  );
}
