"use client";

import * as React from "react";

/* ====================================================================
   PREMIUM CURSOR — green optical dot + trailing halo ring (desktop)

   Design decisions:
   • Mounted ONLY on (pointer: fine) devices with no reduced-motion
     preference — touch/mobile keeps native behaviour untouched.
   • Dot follows the pointer with a tight lerp (snappy, precise);
     the halo ring follows with a soft lerp (trailing, magnetic feel).
   • ONE rAF loop for the whole lifetime; zero React re-renders —
     positions are written straight to `transform` (compositor-only).
   • Hover states are detected via a single delegated `pointerover`
     listener on document (no per-element handlers):
       – interactive (a, button, [role=button], label, summary,
         [data-cursor]) → halo embraces, dot condenses
       – text fields → halo contracts into a precision lens
   • Press feedback on pointerdown/up.
   • The native cursor is hidden via the `custom-cursor-active` html
     class (see globals.css); under prefers-reduced-motion that class
     is never applied AND the stylesheet force-restores the cursor.
   ==================================================================== */

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="tab"], [data-cursor="interactive"], label, summary';

export function PremiumCursor() {
  React.useEffect(() => {
    /* Gate: respect reduced motion only — the pointer gate is handled
       by trusting real events: the cursor activates on the FIRST
       pointermove with pointerType "mouse". Touch devices never emit
       those (their scroll/tap is pointerType "touch"), keyboard users
       keep the native cursor, and hybrid devices just work. */
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedQuery.matches) return;

    const doc = document.documentElement;

    /* Build layers (plain DOM — keeps React out of the hot path). */
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    const dotCore = document.createElement("div");
    dotCore.className = "cursor-dot-core";
    dot.appendChild(dotCore);

    const halo = document.createElement("div");
    halo.className = "cursor-halo";
    halo.setAttribute("aria-hidden", "true");
    const haloRing = document.createElement("div");
    haloRing.className = "cursor-halo-ring";
    halo.appendChild(haloRing);

    const fragment = document.createDocumentFragment();
    fragment.append(halo, dot);
    document.body.appendChild(fragment);

    /* Pointer state (read inside rAF only). */
    let targetX = -100;
    let targetY = -100;
    let dotX = targetX;
    let dotY = targetY;
    let haloX = targetX;
    let haloY = targetY;
    let visible = false;
    let active = false;
    let rafId = 0;

    const DOT_LERP = 0.42; /* tight follow */
    const HALO_LERP = 0.16; /* soft trail */

    const tick = () => {
      dotX += (targetX - dotX) * DOT_LERP;
      dotY += (targetY - dotY) * DOT_LERP;
      haloX += (targetX - haloX) * HALO_LERP;
      haloY += (targetY - haloY) * HALO_LERP;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    const show = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      halo.style.opacity = "1";
    };
    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      halo.style.opacity = "0";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      /* First real mouse movement → take over the cursor. */
      if (!active) {
        active = true;
        doc.classList.add("custom-cursor-active");
      }
      targetX = e.clientX;
      targetY = e.clientY;
      show();
    };

    /* Delegated hover state — no per-element listeners anywhere. */
    const setState = (cls: "is-hover" | "is-text", on: boolean) => {
      dot.classList.toggle(cls, on);
      halo.classList.toggle(cls, on);
    };
    const onPointerOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (!el || !el.closest) return;
      setState("is-hover", Boolean(el.closest(INTERACTIVE_SELECTOR)));
      setState(
        "is-text",
        Boolean(
          el.closest('input:not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]')
        )
      );
    };
    const onPointerDown = () => {
      dot.classList.add("is-down");
      halo.classList.add("is-down");
    };
    const onPointerUp = () => {
      dot.classList.remove("is-down");
      halo.classList.remove("is-down");
    };
    const onLeaveWindow = (e: PointerEvent) => {
      if (!e.relatedTarget) hide();
    };
    const onEnterWindow = () => show();

    /* Dynamic gate loss (e.g. user enables reduced motion live). */
    const onReducedChange = () => {
      if (reducedQuery.matches) teardown();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow, { passive: true });
    document.addEventListener("pointerenter", onEnterWindow, { passive: true });
    reducedQuery.addEventListener("change", onReducedChange);
    rafId = requestAnimationFrame(tick);

    function teardown() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onLeaveWindow);
      document.removeEventListener("pointerenter", onEnterWindow);
      reducedQuery.removeEventListener("change", onReducedChange);
      dot.remove();
      halo.remove();
      doc.classList.remove("custom-cursor-active");
    }

    return teardown;
  }, []);

  return null;
}
