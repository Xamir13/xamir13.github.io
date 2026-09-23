"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { withBase } from "@/lib/paths";

/* ==================================================================== */
/* TIGER INTRO — cinematic loading ident                                 */
/*                                                                       */
/* The navbar tiger's character (same stroke language, same round ears,  */
/* stripes and expression) rebuilt as a fully articulated close-up head  */
/* so the roar can be ANATOMICAL: the lower jaw drops, the upper lip     */
/* curls, the dark maw opens, fangs separate and the tongue sits deep    */
/* in the mouth. Eyes narrow, brows slant, ears pin back, whiskers       */
/* flare — and a REAL tiger recording (CC0) is sample-accurately         */
/* scheduled on the Web-Audio clock at the exact moment the jaw opens.   */
/*                                                                       */
/* TIMELINE (ms from mount)                                              */
/*    0    overlay covers first paint; the tiger is server-rendered      */
/*         VISIBLE and fades in with pure CSS (works before hydration)   */
/*  250    calm — breathing loop                                         */
/*  900    character beat: pupils glance, two slow blinks, ear flick     */
/* 2400    TENSION: brows slant, ears pin back, eyes narrow              */
/* 3100    ANTICIPATION: upper lip curls, closed-mouth line dissolves    */
/* 3600    JAW DROPS (spring) — the REAL tiger recording (CC0) plays     */
/*         here (see AUDIO); head recoils and shakes, fangs              */
/*         separate, tongue revealed, whiskers flare, light surges       */
/* 5940    jaw closes naturally, face settles, ears relax                */
/* 6300    SECONDARY: small jaw re-open (variation — nothing repeats     */
/*         robotically)                                                  */
/* 6860    still calm breath                                             */
/* 7250    cinematic exit (light bloom → fade + scale + blur)            */
/* ~7950  overlay unmounts, audio context closed, all timers/listeners   */
/*         and the rAF loop released — the site was interactive beneath  */
/*                                                                       */
/* BEHAVIOUR                                                             */
/*  - plays once per full load; SPA navigation never replays (module     */
/*    flag; the root layout does not remount on client navigation)       */
/*  - click / tap / Escape / Enter / Space / tab-hidden skips            */
/*  - prefers-reduced-motion: simplified beautiful version (static       */
/*    calm tiger, soft fades, no jaw/roar, no audio)                     */
/*  - autoplay restrictions: the AudioContext is only touched AFTER a    */
/*    user gesture existed (sticky activation). No gesture → the intro   */
/*    runs silently and degrades gracefully — Chrome's autoplay          */
/*    intervention console error is never triggered. The roar asset is   */
/*    preloaded during the calm phase so audio never delays visuals      */
/*  - sound design: the REAL recording + a synced sub impact ONLY.       */
/*    No synthesised ambience/wind/breath layers — the silence before    */
/*    the roar is deliberate                                             */
/*  - hidden on /admin and when JS is unavailable (noscript in layout)   */
/* ==================================================================== */

/* ---- timeline constants (ms) ---- */
const T_TENSION = 2400;
const T_CURL = 3100;
const T_JAW = 3600;
const ROAR_AUDIO_LEAD = 0.14; // seconds after jaw-drop timer (see above)
const T_SETTLE = 5940;
const T_SECONDARY = 6300;
const T_STILL = 6860;
const T_EXIT = 7250;
const T_UNMOUNT = 7950;
const EXIT_MS = 700;

const REDUCED_EXIT = 1800;
const REDUCED_UNMOUNT = 2400;

const ROAR_URL = withBase("/sounds/tiger-roar.mp3");

/* Module-scope guard: one intro per JS context (per full load). */
let introPlayedThisLoad = false;

type Phase =
  | "calm"
  | "tension"
  | "anticipation"
  | "roar"
  | "settle"
  | "secondary"
  | "still"
  | "exit";

/* ==================================================================== */
/* AUDIO ENGINE                                                          */
/* The real CC0 recording only (+ a synced sub impact). Everything is    */
/* gesture-gated and torn down on cleanup — no leaked nodes/contexts,    */
/* no autoplay-intervention console errors, no synthesised stand-ins.    */
/* ==================================================================== */

type Engine = {
  ctx: AudioContext;
  master: GainNode;
  sources: AudioScheduledSourceNode[];
};

function createEngine(): Engine | null {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();

    const master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.knee.value = 18;
    comp.ratio.value = 6;
    comp.attack.value = 0.004;
    comp.release.value = 0.24;
    master.connect(comp);
    comp.connect(ctx.destination);

    return { ctx, master, sources: [] };
  } catch {
    return null;
  }
}

/** Autoplay policy: a context may only start after a user gesture.
    Chrome logs a red console ERROR ("The AudioContext was not allowed
    to start…") when it is created/resumed without one — so we simply
    never touch audio unless activation already happened (sticky
    activation persists across reloads of the same tab). */
function canStartAudio(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userActivation;
  /* userActivation is unavailable on older Safari — attempt anyway;
     those browsers do not log intervention errors. */
  return ua ? ua.hasBeenActive : true;
}

/** THE ROAR — the real recording (already fetched + decoded), plus a
    short sub impact for cinematic weight. If the asset is unavailable
    the intro stays SILENT: no synthesised stand-in, ever. */
function scheduleRoar(
  eng: Engine,
  buffer: AudioBuffer | null,
  at: number
) {
  try {
    if (buffer) {
      const src = eng.ctx.createBufferSource();
      src.buffer = buffer;
      const gain = eng.ctx.createGain();
      gain.gain.value = 0.95;
      src.connect(gain);
      gain.connect(eng.master);
      src.start(at);
      eng.sources.push(src);
    }

    /* Sub-frequency impact — felt more than heard, tied to the roar. */
    const impact = eng.ctx.createOscillator();
    impact.type = "sine";
    impact.frequency.setValueAtTime(72, at);
    impact.frequency.exponentialRampToValueAtTime(40, at + 0.4);
    const impactGain = eng.ctx.createGain();
    impactGain.gain.setValueAtTime(0.0001, at);
    impactGain.gain.exponentialRampToValueAtTime(0.14, at + 0.02);
    impactGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.42);
    impact.connect(impactGain);
    impactGain.connect(eng.master);
    impact.start(at);
    impact.stop(at + 0.45);
    eng.sources.push(impact);
  } catch {
    /* audio must never break the visual intro */
  }
}

function stopEngine(eng: Engine, fade = 0.4) {
  try {
    const now = eng.ctx.currentTime;
    eng.master.gain.cancelScheduledValues(now);
    eng.master.gain.setValueAtTime(eng.master.gain.value, now);
    eng.master.gain.exponentialRampToValueAtTime(0.0001, now + fade);
    for (const node of eng.sources) {
      try {
        node.stop(now + fade + 0.02);
      } catch {
        /* already stopped */
      }
    }
  } catch {
    /* context already closed */
  }
}

function closeEngine(eng: Engine) {
  stopEngine(eng, 0.05);
  try {
    /* close() returns a promise — always attach a handler so a rare
       rejection can never surface as an unhandled rejection. */
    eng.ctx.close()?.catch?.(() => undefined);
  } catch {
    /* already closed */
  }
}

/* ==================================================================== */
/* THE ARTICULATED TIGER                                                 */
/* viewBox 0 0 200 200 (with headroom for the ears + drop for the jaw).  */
/* Paint order: ears → head → face → maw → upper jaw → lower jaw →       */
/* whiskers → voice arcs.                                                */
/* ==================================================================== */

const STROKE = "currentColor";

const strokeProps = {
  stroke: STROKE,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
} as const;

/* Per-phase animation values for every articulated group. */
const V = {
  head: {
    calm: { scale: 1, rotate: 0, y: 0 },
    tension: { scale: 1.025, rotate: 0, y: 2 },
    anticipation: { scale: 1.03, rotate: -0.6, y: -1 },
    roar: { scale: 1.055, rotate: -2.4, y: -6 },
    settle: { scale: 1.015, rotate: 0, y: 0 },
    secondary: { scale: 1.02, rotate: 0.8, y: 1 },
    still: { scale: 1, rotate: 0, y: 0 },
  },
  jawY: { calm: 0, tension: 0, anticipation: 2, roar: 28, settle: 0, secondary: 9, still: 0 } as Record<Phase, number>,
  maw: {
    calm: { scaleY: 0, opacity: 0 },
    tension: { scaleY: 0, opacity: 0 },
    anticipation: { scaleY: 0.1, opacity: 0.4 },
    roar: { scaleY: 1, opacity: 1 },
    settle: { scaleY: 0, opacity: 0 },
    secondary: { scaleY: 0.42, opacity: 1 },
    still: { scaleY: 0, opacity: 0 },
  } as Record<Phase, { scaleY: number; opacity: number }>,
  upperTeeth: {
    calm: { scaleY: 0.05, opacity: 0 },
    tension: { scaleY: 0.05, opacity: 0 },
    anticipation: { scaleY: 0.16, opacity: 0.5 },
    roar: { scaleY: 1, opacity: 1 },
    settle: { scaleY: 0.05, opacity: 0 },
    secondary: { scaleY: 0.5, opacity: 1 },
    still: { scaleY: 0.05, opacity: 0 },
  } as Record<Phase, { scaleY: number; opacity: number }>,
  lip: {
    calm: 1, tension: 1, anticipation: 0.15, roar: 0, settle: 1,
    secondary: 0.25, still: 1,
  } as Record<Phase, number>,
  eyeScale: {
    calm: 1, tension: 0.55, anticipation: 0.45, roar: 0.4,
    settle: 0.78, secondary: 0.55, still: 1,
  } as Record<Phase, number>,
  earRot: {
    calm: 0, tension: -11, anticipation: -13, roar: 0,
    settle: -5, secondary: -8, still: 0,
  } as Record<Phase, number>,
  browRot: {
    calm: 0, tension: 9, anticipation: 11, roar: 12,
    settle: 4, secondary: 8, still: 0,
  } as Record<Phase, number>,
  whiskerRot: {
    calm: 0, tension: -3, anticipation: -5, roar: -9,
    settle: -2, secondary: -5, still: 0,
  } as Record<Phase, number>,
  light: {
    calm: 0.85, tension: 0.9, anticipation: 1, roar: 1.65,
    settle: 0.95, secondary: 1.1, still: 0.85,
  } as Record<Phase, number>,
};

/* Dust motes — few, cheap, composited. */
const DUST = [
  { left: "12%", top: "62%", size: 2.5, dur: 11, delay: -2, o: 0.22 },
  { left: "20%", top: "78%", size: 2, dur: 13, delay: -7, o: 0.16 },
  { left: "30%", top: "70%", size: 3, dur: 9, delay: -4, o: 0.26 },
  { left: "41%", top: "84%", size: 2, dur: 12, delay: -1, o: 0.18 },
  { left: "55%", top: "76%", size: 2.5, dur: 10, delay: -8, o: 0.22 },
  { left: "63%", top: "86%", size: 2, dur: 14, delay: -3, o: 0.15 },
  { left: "72%", top: "68%", size: 3, dur: 9.5, delay: -6, o: 0.24 },
  { left: "81%", top: "80%", size: 2, dur: 12.5, delay: -9, o: 0.17 },
  { left: "88%", top: "60%", size: 2.5, dur: 10.5, delay: -5, o: 0.21 },
  { left: "8%", top: "46%", size: 2, dur: 13.5, delay: -10, o: 0.14 },
  { left: "93%", top: "42%", size: 2, dur: 12, delay: -2, o: 0.15 },
  { left: "48%", top: "90%", size: 2.5, dur: 11.5, delay: -6.5, o: 0.19 },
];

/* Voice arcs — ripple from the mouth during the roar. */
const VOICE_ARCS = [
  "M62,120 C52,132 52,148 62,160",
  "M50,112 C36,130 36,152 50,170",
  "M138,120 C148,132 148,148 138,160",
  "M150,112 C164,130 164,152 150,170",
] as const;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function TigerIntro() {
  const pathname = usePathname();
  /* SSR renders the overlay so it covers the very first paint on the
     routes where it should play; skipped routes never render it. */
  const shouldRunOnRoute = !pathname.startsWith("/admin");
  const [visible, setVisible] = React.useState(shouldRunOnRoute);
  const [phase, setPhase] = React.useState<Phase | null>(null);
  const [reduced, setReduced] = React.useState(false);

  const engineRef = React.useRef<Engine | null>(null);
  const timersRef = React.useRef<number[]>([]);
  const rafRef = React.useRef(0);
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const finishedRef = React.useRef(false);
  /* Removes the skip/lifecycle listeners — called by finish() AND by the
     effect cleanup. Without this, Escape/Enter/Space stay preventDefault-ed
     for the whole session after the intro (breaking keyboard activation
     of links/buttons). */
  const removeGuardsRef = React.useRef<(() => void) | null>(null);

  const clearTimers = React.useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  /* The component stays mounted (returns null) after finishing, so the
     scroll lock must be released the moment the overlay hides — not
     only on unmount. */
  React.useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  const setBar = React.useCallback((pct: number) => {
    const el = barRef.current;
    if (el) el.style.width = `${pct}%`;
  }, []);

  const finish = React.useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimers();
    cancelAnimationFrame(rafRef.current);
    removeGuardsRef.current?.();
    introPlayedThisLoad = true;
    setPhase("exit");
    setBar(100);
    const eng = engineRef.current;
    if (eng) stopEngine(eng, 0.4);
    timersRef.current.push(
      window.setTimeout(() => setVisible(false), EXIT_MS)
    );
  }, [clearTimers, setBar]);

  useIsoLayoutEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!shouldRunOnRoute || introPlayedThisLoad) {
      finishedRef.current = true;
      introPlayedThisLoad = true;
      setVisible(false);
      setPhase(null);
      return;
    }

    /* Mark as started; if the effect is torn down before completion
       (React Strict Mode double-mount in dev) the flag is released so
       the second mount can play it exactly once. */
    introPlayedThisLoad = true;
    finishedRef.current = false;
    document.body.style.overflow = "hidden";
    setReduced(prefersReduced);

    /* ---------------- progress (rAF, zero re-renders) -------------- */
    const start = performance.now();
    let loadGate = document.readyState === "complete" ? 1 : 0.9;
    const onLoads = () => {
      loadGate = 1;
    };
    window.addEventListener("load", onLoads);
    const tick = () => {
      const t = performance.now() - start;
      const p = Math.min(t / T_EXIT, loadGate) * 100;
      setBar(p);
      if (t < T_EXIT && !finishedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    /* ---------------- audio --------------------------------------- */
    /* Sound design: the REAL CC0 recording only. The bytes are fetched
       during the calm phase (no AudioContext needed for a fetch), and
       the context itself is created exclusively at the roar moment and
       only when a user gesture already existed (canStartAudio) — no
       gesture → a deliberately silent intro, and Chrome's autoplay
       intervention console error is never triggered. */
    let roarData: ArrayBuffer | null = null;
    if (!prefersReduced) {
      void (async () => {
        try {
          const res = await fetch(ROAR_URL);
          if (res.ok) roarData = await res.arrayBuffer();
        } catch {
          /* silent intro */
        }
      })();
    }

    const playRoar = async () => {
      if (finishedRef.current || !canStartAudio()) return;
      let eng = engineRef.current;
      if (!eng) {
        eng = createEngine();
        if (!eng) return;
        engineRef.current = eng;
      }
      try {
        if (eng.ctx.state !== "running") await eng.ctx.resume();
      } catch {
        return;
      }
      if (finishedRef.current || eng.ctx.state !== "running") return;

      let buf: AudioBuffer | null = null;
      if (roarData) {
        try {
          buf = await eng.ctx.decodeAudioData(roarData);
        } catch {
          buf = null;
        }
      }
      if (finishedRef.current) return;
      scheduleRoar(eng, buf, eng.ctx.currentTime + ROAR_AUDIO_LEAD);
    };

    /* ---------------- timeline ------------------------------------ */
    const at = (ms: number, fn: () => void) => {
      timersRef.current.push(window.setTimeout(fn, ms));
    };

    if (prefersReduced) {
      /* Simplified beautiful version — no roar, no jaw, no audio. */
      setPhase("still");
      at(REDUCED_EXIT, () => finish());
      at(REDUCED_UNMOUNT, () => setVisible(false));
    } else {
      setPhase("calm");
      at(T_TENSION, () => setPhase("tension"));
      at(T_CURL, () => setPhase("anticipation"));
      at(T_JAW, () => {
        setPhase("roar");
        void playRoar();
      });
      at(T_SETTLE, () => setPhase("settle"));
      at(T_SECONDARY, () => setPhase("secondary"));
      at(T_STILL, () => setPhase("still"));
      at(T_EXIT, () => finish());
    }

    /* ---------------- skip + lifecycle guards --------------------- */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    const onHide = () => {
      if (document.hidden) finish();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onHide);
    const removeGuards = () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onHide);
    };
    removeGuardsRef.current = removeGuards;

    return () => {
      removeGuards();
      removeGuardsRef.current = null;
      window.removeEventListener("load", onLoads);
      clearTimers();
      cancelAnimationFrame(rafRef.current);
      if (!finishedRef.current) {
        /* Strict-Mode/dev teardown before completion → allow replay. */
        introPlayedThisLoad = false;
      }
      document.body.style.overflow = "";
      const eng = engineRef.current;
      engineRef.current = null;
      if (eng) closeEngine(eng);
    };
  }, []);

  if (!visible) return null;

  const p: Phase = phase ?? "calm";
  const exiting = p === "exit";

  /* Derived per-part animation values */
  const headAnim = exiting
    ? { scale: 1.02, rotate: 0, y: 0 }
    : reduced
      ? V.head.still
      : p === "roar"
        ? {
            ...V.head.roar,
            x: [0, -1.6, 1.6, -1.2, 1.2, -0.8, 0.8, 0],
          }
        : p === "calm" || p === "still"
          ? { ...V.head.calm, scale: [1, 1.016, 1] }
          : V.head[p];

  const headTransition = reduced
    ? { duration: 0.4 }
    : p === "roar"
      ? {
          scale: { type: "spring" as const, stiffness: 240, damping: 15 },
          rotate: { duration: 0.3, ease: "easeOut" as const },
          y: { type: "spring" as const, stiffness: 240, damping: 15 },
          x: { duration: 0.62, repeat: 1, ease: "linear" as const },
        }
      : p === "calm" || p === "still"
        ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" as const }
        : { duration: 0.5, ease: "easeInOut" as const };

  const jawY = exiting || reduced ? 0 : V.jawY[p];
  const jawTransition = jawY > V.jawY.settle
    ? { type: "spring" as const, stiffness: 230, damping: 17 }
    : { duration: 0.42, ease: [0.3, 0, 0.2, 1] as const };

  const maw = exiting || reduced ? V.maw.still : V.maw[p];
  const upperTeeth = exiting || reduced ? V.upperTeeth.still : V.upperTeeth[p];
  const lipOp = exiting || reduced ? V.lip.still : V.lip[p];
  const eyeScale = exiting || reduced ? V.eyeScale.still : V.eyeScale[p];
  const earRot = exiting || reduced ? V.earRot.still : V.earRot[p];
  const browRot = exiting || reduced ? V.browRot.still : V.browRot[p];
  const whiskerRot = exiting || reduced ? V.whiskerRot.still : V.whiskerRot[p];
  const lightOp = exiting ? 1.8 : reduced ? 0.85 : V.light[p];

  const eyeTransition = { duration: reduced ? 0.3 : 0.24, ease: "easeOut" as const };
  const earTransition = { duration: reduced ? 0.3 : 0.3, ease: "easeInOut" as const };

  return (
    <AnimatePresence>
      <motion.div
        key="tiger-intro"
        id="tiger-intro"
        role="presentation"
        onClick={finish}
        className="fixed inset-0 z-[200] select-none overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 40%, #17181b 0%, #0d0e10 52%, #070809 100%)",
        }}
        initial={{ opacity: 1 }}
        animate={
          exiting ? { opacity: 0, scale: 1.05, filter: "blur(8px)" } : { opacity: 1 }
        }
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: exiting ? 0.66 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="sr-only">در حال بارگذاری وب‌سایت…</span>

        {/* film grain (static, one-time raster) */}
        <div aria-hidden="true" className="tiger-grain pointer-events-none absolute inset-0" />

        {/* volumetric light — responds to the roar */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute start-1/2 top-[40%] h-[76vmin] w-[76vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            marginLeft: "-38vmin",
            marginTop: "-38vmin",
            background:
              "radial-gradient(closest-side, hsla(36,28%,64%,0.12), hsla(36,28%,64%,0) 72%)",
          }}
          animate={{ opacity: lightOp }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />

        {/* atmospheric dust */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {DUST.map((d, i) => (
            <span
              key={i}
              className="tiger-dust"
              style={
                {
                  left: d.left,
                  top: d.top,
                  width: d.size,
                  height: d.size,
                  opacity: d.o,
                  animationDuration: `${d.dur}s`,
                  animationDelay: `${d.delay}s`,
                  "--dust-o": d.o,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* the tiger — entrance is pure CSS (.tiger-intro-enter) so it is
            visible from the FIRST server-rendered paint, before any JS
            hydrates. Framer-motion drives the articulated phases only. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="tiger-intro-enter text-[#e9e3d5]"
            style={{ willChange: "transform, opacity" }}
          >
            <svg
              viewBox="0 -12 200 224"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{
                width: "min(86vmin, 430px)",
                height: "min(86vmin, 430px)",
              }}
            >
              {/* ============ EARS (behind the head) ============ */}
              <motion.g
                initial={false}
                animate={{ rotate: earRot }}
                transition={earTransition}
                style={{ originX: 0.8, originY: 0.9 }}
              >
                <path
                  d="M64,40 C60,26 50,18 40,22 C32,27 32,40 40,50 C46,56 56,56 64,50"
                  {...strokeProps}
                  strokeWidth="4.2"
                />
                <path
                  d="M50,41 C48,34 44,31 41,33 C39,37 42,42 46,45"
                  {...strokeProps}
                  strokeWidth="2.6"
                  strokeOpacity="0.55"
                />
              </motion.g>
              <motion.g
                initial={false}
                animate={{ rotate: -earRot }}
                transition={earTransition}
                style={{ originX: 0.2, originY: 0.9 }}
              >
                <path
                  d="M136,40 C140,26 150,18 160,22 C168,27 168,40 160,50 C154,56 144,56 136,50"
                  {...strokeProps}
                  strokeWidth="4.2"
                />
                <path
                  d="M150,41 C152,34 156,31 159,33 C161,37 158,42 154,45"
                  {...strokeProps}
                  strokeWidth="2.6"
                  strokeOpacity="0.55"
                />
              </motion.g>

              {/* ============ HEAD (breathing / recoil / shake) ============ */}
              <motion.g
                initial={false}
                animate={headAnim}
                transition={headTransition}
                style={{ originX: 0.5, originY: 0.72 }}
              >
                {/* skull + temples, ending at the jaw corners */}
                <path
                  d="M68,130 C54,117 46,101 46,80 C46,44 70,24 100,24 C130,24 154,44 154,80 C154,101 146,117 132,130"
                  {...strokeProps}
                  strokeWidth="4.2"
                />
                {/* jaw-corner fur curls */}
                <path d="M68,130 C66,134 66,139 69,143" {...strokeProps} strokeWidth="3" strokeOpacity="0.7" />
                <path d="M132,130 C134,134 134,139 131,143" {...strokeProps} strokeWidth="3" strokeOpacity="0.7" />
                {/* forehead stripes */}
                <path d="M100,24 C100,34 100,44 100,52" {...strokeProps} strokeWidth="3.4" strokeOpacity="0.85" />
                <path d="M84,28 C86,37 88,45 90,52" {...strokeProps} strokeWidth="3.2" strokeOpacity="0.75" />
                <path d="M116,28 C114,37 112,45 110,52" {...strokeProps} strokeWidth="3.2" strokeOpacity="0.75" />
                <path d="M68,36 C72,44 74,49 76,54" {...strokeProps} strokeWidth="3" strokeOpacity="0.6" />
                <path d="M132,36 C128,44 126,49 124,54" {...strokeProps} strokeWidth="3" strokeOpacity="0.6" />
                {/* cheek fur tufts */}
                <path d="M47,94 L36,92" {...strokeProps} strokeWidth="2.6" strokeOpacity="0.55" />
                <path d="M45,107 L33,107" {...strokeProps} strokeWidth="2.6" strokeOpacity="0.55" />
                <path d="M47,119 L37,124" {...strokeProps} strokeWidth="2.6" strokeOpacity="0.55" />
                <path d="M153,94 L164,92" {...strokeProps} strokeWidth="2.6" strokeOpacity="0.55" />
                <path d="M155,107 L167,107" {...strokeProps} strokeWidth="2.6" strokeOpacity="0.55" />
                <path d="M153,119 L163,124" {...strokeProps} strokeWidth="2.6" strokeOpacity="0.55" />

                {/* ============ EYES ============ */}
                {/* left */}
                <motion.g
                  initial={false}
                  animate={{
                    scaleY: eyeScale,
                    rotate: p === "calm" || p === "still" || exiting ? 0 : 4,
                  }}
                  transition={eyeTransition}
                  style={{ originX: 0.05, originY: 0.55 }}
                >
                  <motion.g
                    initial={false}
                    animate={
                      !reduced && (p === "calm" || p === "still")
                        ? {
                            scaleY: [1, 1, 0.07, 1, 1, 0.09, 1, 1],
                          }
                        : { scaleY: 1 }
                    }
                    transition={
                      !reduced && (p === "calm" || p === "still")
                        ? { duration: 4.6, times: [0, 0.3, 0.34, 0.38, 0.72, 0.76, 0.8, 1], ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                    style={{ originX: 0.5, originY: 0.5 }}
                  >
                    <path
                      d="M58,82 C62,74 80,72 86,80 C80,86 62,86 58,82 Z"
                      stroke={STROKE}
                      strokeWidth="3.2"
                      strokeLinejoin="round"
                      fill="#0b0b0c"
                      fillOpacity="0.6"
                    />
                    <motion.circle
                      cx="73"
                      cy="80"
                      r="3.1"
                      fill={STROKE}
                      initial={false}
                      animate={
                        !reduced && (p === "calm" || p === "still")
                          ? { x: [0, -3.4, -3.4, 0, 0, 3, 3, 0] }
                          : { x: 0 }
                      }
                      transition={
                        !reduced && (p === "calm" || p === "still")
                          ? { duration: 5.2, times: [0, 0.18, 0.3, 0.42, 0.55, 0.68, 0.8, 1], ease: "easeInOut" }
                          : { duration: 0.25 }
                      }
                    />
                  </motion.g>
                </motion.g>
                {/* right */}
                <motion.g
                  initial={false}
                  animate={{
                    scaleY: eyeScale,
                    rotate: p === "calm" || p === "still" || exiting ? 0 : -4,
                  }}
                  transition={eyeTransition}
                  style={{ originX: 0.95, originY: 0.55 }}
                >
                  <motion.g
                    initial={false}
                    animate={
                      !reduced && (p === "calm" || p === "still")
                        ? { scaleY: [1, 1, 0.07, 1, 1, 0.09, 1, 1] }
                        : { scaleY: 1 }
                    }
                    transition={
                      !reduced && (p === "calm" || p === "still")
                        ? { duration: 4.75, times: [0, 0.3, 0.34, 0.38, 0.72, 0.76, 0.8, 1], ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                    style={{ originX: 0.5, originY: 0.5 }}
                  >
                    <path
                      d="M142,82 C138,74 120,72 114,80 C120,86 138,86 142,82 Z"
                      stroke={STROKE}
                      strokeWidth="3.2"
                      strokeLinejoin="round"
                      fill="#0b0b0c"
                      fillOpacity="0.6"
                    />
                    <motion.circle
                      cx="127"
                      cy="80"
                      r="3.1"
                      fill={STROKE}
                      initial={false}
                      animate={
                        !reduced && (p === "calm" || p === "still")
                          ? { x: [0, -3.4, -3.4, 0, 0, 3, 3, 0] }
                          : { x: 0 }
                      }
                      transition={
                        !reduced && (p === "calm" || p === "still")
                          ? { duration: 5.2, times: [0, 0.18, 0.3, 0.42, 0.55, 0.68, 0.8, 1], ease: "easeInOut" }
                          : { duration: 0.25 }
                      }
                    />
                  </motion.g>
                </motion.g>

                {/* ============ BROWS ============ */}
                <motion.g
                  initial={false}
                  animate={{ rotate: browRot, y: browRot > 1 ? 1.4 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ originX: 0.08, originY: 0.6 }}
                >
                  <path d="M56,64 C62,60 74,60 82,64" {...strokeProps} strokeWidth="3.2" strokeOpacity="0.85" />
                </motion.g>
                <motion.g
                  initial={false}
                  animate={{ rotate: -browRot, y: browRot > 1 ? 1.4 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ originX: 0.92, originY: 0.6 }}
                >
                  <path d="M118,64 C126,60 138,60 144,64" {...strokeProps} strokeWidth="3.2" strokeOpacity="0.85" />
                </motion.g>
                {/* brow scrunch lines (appear with tension) */}
                <motion.path
                  d="M96,60 C97,65 97,69 96,73"
                  {...strokeProps}
                  strokeWidth="2.2"
                  initial={false}
                  animate={{ opacity: browRot > 2 ? 0.65 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.path
                  d="M104,60 C103,65 103,69 104,73"
                  {...strokeProps}
                  strokeWidth="2.2"
                  initial={false}
                  animate={{ opacity: browRot > 2 ? 0.65 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* ============ NOSE + MUZZLE ============ */}
                <motion.g
                  initial={false}
                  animate={{ y: p === "roar" ? -1.4 : 0, scaleY: p === "roar" ? 1.07 : 1 }}
                  transition={{ duration: 0.25 }}
                  style={{ originX: 0.5, originY: 1 }}
                >
                  <path d="M94,88 C94,96 95,102 96,107" {...strokeProps} strokeWidth="2.8" strokeOpacity="0.75" />
                  <path d="M106,88 C106,96 105,102 104,107" {...strokeProps} strokeWidth="2.8" strokeOpacity="0.75" />
                  <path
                    d="M91,107 C95,104 105,104 109,107 C108,113 104,117 100,118 C96,117 92,113 91,107 Z"
                    {...strokeProps}
                    strokeWidth="3.2"
                  />
                  <circle cx="95.4" cy="110" r="1.1" fill={STROKE} fillOpacity="0.8" />
                  <circle cx="104.6" cy="110" r="1.1" fill={STROKE} fillOpacity="0.8" />
                  {/* snarl wrinkles beside the nose (roar only) */}
                  <motion.path
                    d="M88,112 L81,115"
                    {...strokeProps}
                    strokeWidth="2.2"
                    initial={false}
                    animate={{ opacity: p === "roar" || p === "anticipation" ? 0.8 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.path
                    d="M112,112 L119,115"
                    {...strokeProps}
                    strokeWidth="2.2"
                    initial={false}
                    animate={{ opacity: p === "roar" || p === "anticipation" ? 0.8 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.g>
                <path d="M91,109 C82,112 74,117 70,124" {...strokeProps} strokeWidth="2.8" strokeOpacity="0.7" />
                <path d="M109,109 C118,112 126,117 130,124" {...strokeProps} strokeWidth="2.8" strokeOpacity="0.7" />

                {/* ============ THE MAW (dark cavity — scales open) ============ */}
                <motion.path
                  d="M80,128 C82,152 88,170 100,177 C112,170 118,152 120,128 Z"
                  fill="#08090a"
                  fillOpacity="0.96"
                  stroke="none"
                  initial={false}
                  animate={{ scaleY: maw.scaleY, opacity: maw.opacity }}
                  transition={
                    maw.scaleY > 0.6
                      ? { scaleY: { type: "spring", stiffness: 230, damping: 17 }, opacity: { duration: 0.15 } }
                      : { duration: 0.42, ease: "easeInOut" }
                  }
                  style={{ originX: 0.5, originY: 0 }}
                />

                {/* ============ UPPER JAW (lip curl + fangs) ============ */}
                <motion.g
                  initial={false}
                  animate={{
                    rotate: p === "roar" ? -3 : p === "anticipation" ? -2.2 : 0,
                    y: p === "roar" || p === "anticipation" ? -1.6 : 0,
                  }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  style={{ originX: 0.5, originY: 0 }}
                >
                  {/* closed-mouth line — dissolves as the jaw opens */}
                  <motion.path
                    d="M84,128 Q100,135 116,128"
                    {...strokeProps}
                    strokeWidth="3.6"
                    initial={false}
                    animate={{ opacity: lipOp }}
                    transition={{ duration: 0.16 }}
                  />
                  {/* philtrum */}
                  <path d="M100,118 L100,127" {...strokeProps} strokeWidth="2.8" strokeOpacity="0.8" />
                  {/* upper fangs — fold up into the lip when closed */}
                  <motion.g
                    initial={false}
                    animate={{ scaleY: upperTeeth.scaleY, opacity: upperTeeth.opacity }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ originX: 0.5, originY: 0 }}
                  >
                    <path
                      d="M85,131 C84,139 86,148 90,154 C93,148 93,139 92,131 Z"
                      fill="#efe9dc"
                      stroke="#0c0c0d"
                      strokeWidth="1"
                    />
                    <path
                      d="M115,131 C116,139 114,148 110,154 C107,148 107,139 108,131 Z"
                      fill="#efe9dc"
                      stroke="#0c0c0d"
                      strokeWidth="1"
                    />
                    <path d="M94.5,131 L96.5,138 L98.5,131 Z" fill="#efe9dc" stroke="#0c0c0d" strokeWidth="0.8" />
                    <path d="M99,131 L100.5,138.5 L102,131 Z" fill="#efe9dc" stroke="#0c0c0d" strokeWidth="0.8" />
                    <path d="M103.5,131 L105.5,138 L107.5,131 Z" fill="#efe9dc" stroke="#0c0c0d" strokeWidth="0.8" />
                  </motion.g>
                </motion.g>

                {/* ============ LOWER JAW (drops) ============ */}
                <motion.g
                  initial={false}
                  animate={{ y: jawY, rotate: jawY > 4 ? 1.2 : 0 }}
                  transition={jawTransition}
                  style={{ originX: 0.5, originY: 0 }}
                >
                  {/* tongue + lower teeth (revealed with the maw) */}
                  <motion.g
                    initial={false}
                    animate={{ scaleY: maw.scaleY, opacity: maw.opacity }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ originX: 0.5, originY: 0.18 }}
                  >
                    <path
                      d="M93,146 C96,141 104,141 107,146 C104,150 96,150 93,146 Z"
                      fill="#8a3a44"
                      fillOpacity="0.92"
                      stroke="none"
                    />
                    <path
                      d="M88,150 C87,144 88,138 90,134 C92,138 92,144 91,150 Z"
                      fill="#efe9dc"
                      stroke="#0c0c0d"
                      strokeWidth="1"
                    />
                    <path
                      d="M112,150 C113,144 112,138 110,134 C108,138 108,144 109,150 Z"
                      fill="#efe9dc"
                      stroke="#0c0c0d"
                      strokeWidth="1"
                    />
                    <path d="M95,150 L96.4,145.5 L98,150 Z" fill="#efe9dc" stroke="#0c0c0d" strokeWidth="0.8" />
                    <path d="M102,150 L103.6,145.5 L105,150 Z" fill="#efe9dc" stroke="#0c0c0d" strokeWidth="0.8" />
                  </motion.g>
                  {/* jaw outline + chin */}
                  <path
                    d="M87,130 C88,141 92,148 100,149 C108,148 112,141 113,130"
                    {...strokeProps}
                    strokeWidth="4.2"
                  />
                  <path d="M94,149 C96,153 104,153 106,149" {...strokeProps} strokeWidth="2.6" strokeOpacity="0.6" />
                </motion.g>

                {/* ============ WHISKERS ============ */}
                <motion.g
                  initial={false}
                  animate={{ rotate: whiskerRot }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ originX: 0.92, originY: 0.55 }}
                >
                  <path d="M74,119 C60,112 46,108 34,108" {...strokeProps} strokeWidth="2" strokeOpacity="0.6" />
                  <path d="M72,126 C56,122 42,122 30,124" {...strokeProps} strokeWidth="2" strokeOpacity="0.6" />
                  <path d="M76,132 C62,132 48,136 36,140" {...strokeProps} strokeWidth="2" strokeOpacity="0.6" />
                  <circle cx="76" cy="120" r="1" fill={STROKE} fillOpacity="0.55" />
                  <circle cx="74" cy="126" r="1" fill={STROKE} fillOpacity="0.55" />
                  <circle cx="77" cy="132" r="1" fill={STROKE} fillOpacity="0.55" />
                </motion.g>
                <motion.g
                  initial={false}
                  animate={{ rotate: -whiskerRot }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ originX: 0.08, originY: 0.55 }}
                >
                  <path d="M126,119 C140,112 154,108 166,108" {...strokeProps} strokeWidth="2" strokeOpacity="0.6" />
                  <path d="M128,126 C144,122 158,122 170,124" {...strokeProps} strokeWidth="2" strokeOpacity="0.6" />
                  <path d="M124,132 C138,132 152,136 164,140" {...strokeProps} strokeWidth="2" strokeOpacity="0.6" />
                  <circle cx="124" cy="120" r="1" fill={STROKE} fillOpacity="0.55" />
                  <circle cx="126" cy="126" r="1" fill={STROKE} fillOpacity="0.55" />
                  <circle cx="123" cy="132" r="1" fill={STROKE} fillOpacity="0.55" />
                </motion.g>
              </motion.g>

              {/* ============ VOICE ARCS (outside the head — no shake) ============ */}
              {VOICE_ARCS.map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  {...strokeProps}
                  strokeWidth="2.4"
                  strokeOpacity="0.6"
                  initial={false}
                  animate={
                    !reduced && p === "roar"
                      ? { opacity: [0, 0.85, 0], scale: [0.72, 1, 1.22] }
                      : { opacity: 0, scale: 0.72 }
                  }
                  transition={
                    !reduced && p === "roar"
                      ? { duration: 0.5, delay: i * 0.09, repeat: 1, ease: "easeOut" }
                      : { duration: 0.18 }
                  }
                  style={{ originX: 0.5, originY: 0.5 }}
                />
              ))}
            </svg>
          </div>

        </div>

        {/* progress — thin cinematic line */}
        <div className="absolute inset-x-0 bottom-9 flex justify-center">
          <div className="h-[3px] w-[min(230px,42vw)] overflow-hidden rounded-full bg-white/10">
            <div
              ref={barRef}
              className="h-full w-0 rounded-full bg-primary"
              style={{ boxShadow: "0 0 10px hsl(var(--primary)/0.55)" }}
            />
          </div>
        </div>

        {/* skip hint */}
        <motion.button
          type="button"
          onClick={finish}
          className="absolute bottom-7 end-6 cursor-pointer text-[11px] tracking-[0.18em] text-white/35 transition-colors hover:text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          رد شدن
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

