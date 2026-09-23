"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ====================================================================
   TERMINAL BOOT — developer-terminal loading experience

   Identity: deep dark canvas + faint grid + scanlines + green terminal
   accents + monospace futurism — the site "boots" into a terminal
   session. The centerpiece is the CLASSIC CLI SPINNER (| / - \) running
   on the active process line, exactly like a real shell task.

   Sequence (visual hierarchy):
   1. minimal window appears, spinner already running on the init line
   2. staged boot lines print beneath it (progress feedback)
   3. progress rail advances on REAL milestones (staged lines, fonts,
      window load — it holds back on genuinely slow connections)
   4. signature/identity fades in with a blinking block cursor
   5. completion: spinner DECELERATES and settles on ✓, rail reaches 100%
   6. window lifts + overlay dissolves over the already-rendered page

   Engineering:
   • Readiness-gated: exit waits for min display time AND window load +
     fonts — never artificially delayed, hard-capped at 5s so it can
     NEVER block the site. The page renders/hydrates BEHIND the overlay.
   • Zero per-frame re-renders: the spinner writes textContent through a
     ref; the rail writes transform through a ref. React re-renders only
     3× (ready → exit → done).
   • RTL/LTR: BOTH language variants exist in the markup and CSS picks
     one from <html dir> (set pre-paint). The spinner glyph lives in a
     dir="ltr" isolated span — direction can never mirror or shift it.
   • Once per browser session (sessionStorage) with a PRE-PAINT skip
     (html[data-boot-skip]) so returning users never see it.
   • prefers-reduced-motion → minimal functional variant: static glyph,
     everything visible at once, quick opacity-only fade.
   • aria-hidden (purely decorative); screen readers go to real content.
   ==================================================================== */

/* the four classic CLI spinner frames, in rotation order */
const FRAMES = ["|", "/", "-", "\\"];

const INIT_LINE = {
  fa: "راه‌اندازی محیط پرتفولیو…",
  en: "initializing portfolio environment…",
};

const BOOT_LINES: { fa: string; en: string }[] = [
  { fa: "بارگذاری پروژه‌ها…", en: "loading projects…" },
  { fa: "بارگذاری مهارت‌ها…", en: "loading skills…" },
  { fa: "بارگذاری تجربه‌ها…", en: "loading experience…" },
  { fa: "بارگذاری بلاگ…", en: "loading blog…" },
];

const SIGNATURE = {
  fa: "امیرعلی طاهری — توسعه‌دهنده فول‌استک",
  en: "AmirAli Taheri — Full-Stack Developer",
};

/* --- timing (ms) ---------------------------------------------------- */
const SPIN_MS = 90; /* classic terminal spinner cadence */
const LINE_START_S = 0.05; /* active line appears almost instantly */
const LINE_STAGGER_S = 0.22;
const SIGNATURE_AT_S = 1.15;
const MIN_MS = 2050; /* shortest readable run of the sequence */
const CAP_MS = 5000; /* hard ceiling — never hold the site hostage */
const READY_HOLD_MS = 850; /* show the settled ✓ state before exit */
const EXIT_MS = 520; /* keep in sync with the CSS exit transition */

export function TerminalBoot() {
  const [phase, setPhase] = React.useState<
    "boot" | "ready" | "exit" | "done"
  >("boot");
  const spinnerRef = React.useRef<HTMLSpanElement>(null);
  const railRef = React.useRef<HTMLSpanElement>(null);
  const phaseRef = React.useRef<"boot" | "ready">("boot");

  React.useEffect(() => {
    let alive = true;
    const cleanups: (() => void)[] = [];

    /* Repeat visit in this session → never even paint (pre-paint script
       has usually already set the attribute). */
    let skip = false;
    try {
      if (sessionStorage.getItem("term-boot-seen")) skip = true;
    } catch {
      /* private mode etc. — show the boot once */
    }
    if (skip || document.documentElement.hasAttribute("data-boot-skip")) {
      document.documentElement.setAttribute("data-boot-skip", "");
      setPhase("done");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    /* ------------------------------------------------------------
       THE CLI SPINNER — single character cycling | / - \ through a
       ref (no re-renders). Fixed-width box → zero layout shift.
       On "ready" it decelerates like a real task finishing, then
       settles on ✓. Reduced motion → a single static frame.
       ------------------------------------------------------------ */
    let frame = 0;
    let delay = SPIN_MS;
    let spinTimer = 0;
    const spin = () => {
      if (!alive) return;
      const el = spinnerRef.current;
      if (reduce) {
        if (el) el.textContent = "|";
        return;
      }
      if (el) el.textContent = FRAMES[frame % FRAMES.length]!;
      frame++;
      if (phaseRef.current === "ready") {
        delay = Math.min(Math.round(delay * 1.55), 420);
        if (delay >= 400) {
          if (el) el.textContent = "✓";
          return;
        }
      }
      spinTimer = window.setTimeout(spin, delay);
    };
    spin();
    cleanups.push(() => window.clearTimeout(spinTimer));

    /* ------------------------------------------------------------
       PROGRESS RAIL — advances on real milestones only: staged line
       reveals, fonts parsed, window loaded. Holds back on slow
       connections; never invents percentages.
       ------------------------------------------------------------ */
    let progress = 0.06;
    const setProgress = (p: number) => {
      if (!alive || !railRef.current) return;
      progress = Math.max(progress, Math.min(p, 1));
      railRef.current.style.transform = `scaleX(${progress})`;
    };
    setProgress(0.06);
    const bumps = [0.24, 0.42, 0.6, 0.78];
    bumps.forEach((p, i) => {
      const t = window.setTimeout(
        () => setProgress(p),
        reduce ? 0 : (LINE_START_S + (i + 1) * LINE_STAGGER_S) * 1000
      );
      cleanups.push(() => window.clearTimeout(t));
    });

    let fontsDone = reduce;
    let loadDone = reduce;
    if (!reduce) {
      const onFonts = () => {
        fontsDone = true;
        setProgress(0.86);
        tryFinish();
      };
      if (typeof document.fonts !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(onFonts).catch(() => {
          fontsDone = true;
        });
      } else {
        fontsDone = true;
      }
      if (document.readyState === "complete") {
        loadDone = true;
        setProgress(0.94);
      } else {
        const onLoad = () => {
          loadDone = true;
          setProgress(0.94);
          tryFinish();
        };
        window.addEventListener("load", onLoad, { once: true });
        cleanups.push(() => window.removeEventListener("load", onLoad));
      }
    }

    /* ------------------------------------------------------------
       COMPLETION GATING — min display ∧ real readiness, hard cap.
       ------------------------------------------------------------ */
    const startedAt = Date.now();
    const MIN = reduce ? 500 : MIN_MS;
    const CAP = reduce ? 1200 : CAP_MS;
    let finished = false;

    function tryFinish() {
      if (!alive || finished) return;
      if (Date.now() - startedAt < MIN) return;
      if (!fontsDone || !loadDone) return;
      finished = true;
      setProgress(1);
      phaseRef.current = "ready";
      setPhase("ready");
      window.setTimeout(() => {
        if (alive) setPhase("exit");
      }, reduce ? 350 : READY_HOLD_MS);
      window.setTimeout(() => {
        if (!alive) return;
        try {
          sessionStorage.setItem("term-boot-seen", "1");
        } catch {
          /* non-fatal */
        }
        setPhase("done");
      }, reduce ? 900 : READY_HOLD_MS + EXIT_MS + 280);
    }

    const minTimer = window.setTimeout(tryFinish, MIN);
    const capTimer = window.setTimeout(() => {
      fontsDone = true;
      loadDone = true;
      tryFinish();
    }, CAP);
    cleanups.push(() => {
      window.clearTimeout(minTimer);
      window.clearTimeout(capTimer);
    });
    tryFinish(); /* everything may already be ready (fast repeat loads) */

    return () => {
      alive = false;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "term-boot",
        phase === "ready" && "is-ready",
        phase === "exit" && "is-exit"
      )}
    >
      {/* grid + scanlines + vignette live in CSS (background/::before/::after) */}

      <div className="term-boot-window">
        {/* window chrome */}
        <div className="term-boot-bar">
          <span className="term-boot-dots">
            <i />
            <i />
            <i />
          </span>
          <span dir="ltr" className="term-boot-host">
            amirali@dev: ~/portfolio
          </span>
        </div>

        {/* terminal body */}
        <div className="term-boot-body">
          {/* ACTIVE PROCESS LINE — the classic | / - \ spinner */}
          <p
            className="term-boot-line term-boot-active"
            style={{ animationDelay: `${LINE_START_S}s` }}
          >
            <span
              dir="ltr"
              className={cn(
                "term-boot-spinner",
                phase !== "boot" && "is-settled"
              )}
            >
              <span ref={spinnerRef}>|</span>
            </span>
            <span className="boot-fa">{INIT_LINE.fa}</span>
            <span dir="ltr" className="boot-en">
              {INIT_LINE.en}
            </span>
          </p>

          {/* staged sub-tasks */}
          {BOOT_LINES.map((line, i) => (
            <p
              key={line.en}
              className="term-boot-line"
              style={{
                animationDelay: `${LINE_START_S + (i + 1) * LINE_STAGGER_S}s`,
              }}
            >
              <span className="boot-fa">{line.fa}</span>
              <span dir="ltr" className="boot-en">
                {line.en}
              </span>
            </p>
          ))}

          {/* milestone-driven progress rail */}
          <div className="term-boot-progress">
            <span ref={railRef} />
          </div>

          {/* portfolio identity */}
          <p
            className="term-boot-signature"
            style={{ animationDelay: `${SIGNATURE_AT_S}s` }}
          >
            <span className="boot-fa">{SIGNATURE.fa}</span>
            <span dir="ltr" className="boot-en">{SIGNATURE.en}</span>
            <span className="term-boot-caret" />
          </p>
        </div>
      </div>
    </div>
  );
}
