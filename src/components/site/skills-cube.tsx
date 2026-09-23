"use client";

import * as React from "react";
import {
  SiDocker,
  SiFigma,
  SiGit,
  SiLinux,
  SiNginx,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiTailwindcss,
  SiTanstack,
  SiTypescript,
} from "react-icons/si";
import { Brain, MessagesSquare, Puzzle, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang";
import { TiltCard } from "@/components/site/tilt-card";
import type { SkillCategory } from "@/lib/site-data";

/* ====================================================================
   SKILLS 3D — flip-to-cube category cards

   • Each of the FOUR category cards is keyboard-accessible (Enter/
     Space, aria-pressed) and flips to a small real-3D cube showing
     that category's four strongest tools — native CSS preserve-3d,
     no libraries, compositor-only, fully reversible.
   • FREE ROTATION: every cube can be dragged with the mouse/pen and
     spun continuously in ANY direction (no angle snapping). The drag
     continues seamlessly from the idle orbit's exact current pose,
     releases with inertia into the same slow idle drift, and never
     snaps back. Touch is left untouched (tap still flips, page scroll
     is never hijacked); under prefers-reduced-motion a drag freezes
     in place with no autonomous motion.
   • The cube is the ONLY content on the flip's back face — no text,
     label or caption underneath it (per request).
   ==================================================================== */

type TechFace = {
  name: string;
  Icon: React.ComponentType<{ size?: number | string; className?: string }> | LucideIcon;
};

/** The four strongest technologies per skill category (cube back). */
const CATEGORY_CUBES: Record<string, TechFace[]> = {
  langs: [
    { name: "TypeScript", Icon: SiTypescript },
    { name: "React", Icon: SiReact },
    { name: "Next.js", Icon: SiNextdotjs },
    { name: "Node.js", Icon: SiNodedotjs },
  ],
  devops: [
    { name: "Docker", Icon: SiDocker },
    { name: "Git", Icon: SiGit },
    { name: "Linux", Icon: SiLinux },
    { name: "Nginx", Icon: SiNginx },
  ],
  soft: [
    { name: "Problem Solving", Icon: Puzzle },
    { name: "Teamwork", Icon: Users },
    { name: "Critical Thinking", Icon: Brain },
    { name: "Communication", Icon: MessagesSquare },
  ],
  tools: [
    { name: "Prisma", Icon: SiPrisma },
    { name: "TanStack", Icon: SiTanstack },
    { name: "Tailwind CSS", Icon: SiTailwindcss },
    { name: "Figma", Icon: SiFigma },
  ],
};

/* ------------------------------------------------------------------ */
/* TechCube — mini 4-side cube (2 subtle caps), used inside flip cards */
/* Free mouse/pen drag-rotation with seamless CSS-orbit handoff.       */
/* ------------------------------------------------------------------ */

const FACE_TRANSFORMS = [
  "translateZ(calc(var(--cube-size) / 2))", // front
  "rotateY(90deg) translateZ(calc(var(--cube-size) / 2))", // right
  "rotateY(180deg) translateZ(calc(var(--cube-size) / 2))", // back
  "rotateY(-90deg) translateZ(calc(var(--cube-size) / 2))", // left
  "rotateX(90deg) translateZ(calc(var(--cube-size) / 2))", // top
  "rotateX(-90deg) translateZ(calc(var(--cube-size) / 2))", // bottom
];

/** deg per px of pointer travel — natural trackball feel. */
const DRAG_SENS = 0.35;
/** Post-release idle drift ≈ the original 40s slow orbit (deg/frame). */
const IDLE_SPIN = 0.15;
const INERTIA_DECAY = 0.92;

/**
 * Read the cube's CURRENT animated rotation so a drag continues the
 * orbit seamlessly. Transform list "rotateX(a) rotateY(b)" composes to
 * C = Rx(a)·Ry(b); matrix3d is stored column-major, so m00=v[0],
 * m02=v[8], m11=v[5], m21=v[6] and b = atan2(m02, m00), a = atan2(m21, m11).
 */
function decomposeCubePose(el: HTMLElement): { rx: number; ry: number } {
  const t = getComputedStyle(el).transform;
  const m = t && t !== "none" ? t.match(/^matrix3d\(([^)]+)\)$/) : null;
  if (!m) return { rx: -16, ry: 24 };
  const v = m[1]!
    .split(",")
    .map((s) => parseFloat(s.trim()));
  if (v.length !== 16 || v.some((n) => Number.isNaN(n)))
    return { rx: -16, ry: 24 };
  const deg = (r: number) => (r * 180) / Math.PI;
  return {
    rx: deg(Math.atan2(v[6]!, v[5]!)),
    ry: deg(Math.atan2(v[8]!, v[0]!)),
  };
}

export function TechCube({
  faces,
  size,
  iconSize = 40,
  slow = false,
  shadow = true,
}: {
  /** 6 faces for a full cube; 4 faces → sides, top/bottom stay caps. */
  faces: TechFace[];
  /** CSS size, e.g. "clamp(150px, 40vw, 220px)". */
  size: string;
  /** Logo size in px. */
  iconSize?: number;
  slow?: boolean;
  shadow?: boolean;
}) {
  const six = faces.length >= 6 ? faces : null;
  const sides = six ? six : faces;
  /* 6-face cube: 6 real faces. 4-face mini cube: 4 sides + 2 caps. */
  const rendered = six ?? [...sides, ...sides.slice(0, 2)];

  /* --- free-rotation state (refs only — zero re-renders per frame) --- */
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const cubeRef = React.useRef<HTMLDivElement>(null);
  const pose = React.useRef({ rx: -16, ry: 24 });
  const vel = React.useRef({ rx: 0, ry: 0 });
  const drag = React.useRef<{
    id: number;
    lastX: number;
    lastY: number;
    dist: number;
  } | null>(null);
  const suppressClick = React.useRef(false);
  const manual = React.useRef(false); /* JS owns the transform */
  const visible = React.useRef(true);
  const reduceRef = React.useRef(false);

  /* The rAF loop lives inside one effect (compiler-safe closure); the
     pointer handlers reach it through this stable ref — zero re-renders. */
  const controls = React.useRef<{ start: () => void; stop: () => void }>({
    start: () => {},
    stop: () => {},
  });

  React.useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = 0;
    function step() {
      raf = 0;
      const cube = cubeRef.current;
      if (!cube || !manual.current || !visible.current) return;
      if (!drag.current && !reduceRef.current) {
        /* inertia decays, easing into the slow idle drift (no snap) */
        vel.current.rx *= INERTIA_DECAY;
        vel.current.ry *= INERTIA_DECAY;
        if (Math.abs(vel.current.rx) < 0.005) vel.current.rx = 0;
        vel.current.ry += (IDLE_SPIN - vel.current.ry) * 0.04;
        pose.current.rx += vel.current.rx;
        pose.current.ry += vel.current.ry;
      }
      cube.style.transform = `rotateX(${pose.current.rx}deg) rotateY(${pose.current.ry}deg)`;
      raf = requestAnimationFrame(step);
    }
    controls.current = {
      start: () => {
        if (raf === 0 && manual.current && visible.current)
          raf = requestAnimationFrame(step);
      },
      stop: () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
    };
    return () => controls.current.stop();
  }, []);

  /* Pause the JS-driven motion while the cube is off-screen. */
  React.useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) controls.current.start();
        else controls.current.stop();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    /* Mouse/pen only — touch keeps native tap-to-flip + page scroll. */
    if (e.pointerType === "touch" || e.button !== 0) return;
    const cube = cubeRef.current;
    if (!cube) return;
    e.preventDefault(); /* no text selection / native image drag */
    if (!manual.current) {
      /* Seamless handoff: continue from the orbit's exact pose — written
         synchronously so no frame ever shows an unrotated cube. */
      pose.current = decomposeCubePose(cube);
      manual.current = true;
      cube.style.animation = "none";
      cube.style.transform = `rotateX(${pose.current.rx}deg) rotateY(${pose.current.ry}deg)`;
    }
    drag.current = {
      id: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY,
      dist: 0,
    };
    vel.current = { rx: 0, ry: 0 };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic/detached pointers — drag still works while hovering */
    }
    controls.current.start();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;
    d.lastX = e.clientX;
    d.lastY = e.clientY;
    d.dist += Math.abs(dx) + Math.abs(dy);
    pose.current.ry += dx * DRAG_SENS;
    pose.current.rx -= dy * DRAG_SENS;
    vel.current.ry = dx * DRAG_SENS;
    vel.current.rx = -dy * DRAG_SENS;
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    /* A real drag must NOT flip the card (the click follows pointerup). */
    suppressClick.current = d.dist > 4;
    if (reduceRef.current) controls.current.stop(); /* freeze in place */
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      ref={sceneRef}
      className="cube-scene mx-auto cursor-grab select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={onClickCapture}
      style={{ width: size, height: size } as React.CSSProperties}
    >
      <div
        ref={cubeRef}
        className={cn("cube h-full w-full", slow && "is-slow")}
        style={{ "--cube-size": size } as React.CSSProperties}
      >
        {rendered.map((face, i) => {
          const isCap = !six && i >= sides.length;
          return (
            <div
              key={`${face.name}-${i}`}
              className={cn(
                "cube-face",
                i === 4 && "is-top",
                i === 5 && "is-bottom"
              )}
              style={{ transform: FACE_TRANSFORMS[i] }}
            >
              {isCap ? (
                /* top/bottom caps of the mini cube — subtle brand-free dot */
                <span
                  aria-hidden="true"
                  className="block h-1.5 w-1.5 rounded-full bg-primary/50"
                />
              ) : (
                <>
                  <face.Icon
                    size={iconSize}
                    className="text-foreground/85"
                  />
                  <span
                    dir="ltr"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    {face.name}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
      {shadow ? <span className="cube-shadow" aria-hidden="true" /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flip card — front: category skills · back: 3D mini cube             */
/* ------------------------------------------------------------------ */

function TechFlipCard({ category }: { category: SkillCategory }) {
  const { t, pick } = useLang();
  const [flipped, setFlipped] = React.useState(false);
  const cubeFaces = CATEGORY_CUBES[category.id] ?? [];
  const title = pick(category.title, category.titleEn);

  const toggle = () => setFlipped((f) => !f);

  return (
    /* Premium depth hover on the outer scene (flat tilt only — the inner
       flip scene owns preserve-3d, so no content layers here). */
    <TiltCard
      className="h-[300px] w-full max-w-[320px]"
      contentLift={0}
      maxTilt={4.5}
      lightClassName="rounded-xl"
    >
    <div className="flip-scene h-full w-full">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${title} — ${t("cube.ariaSuffix")}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={cn(
          "flip-inner h-full w-full outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl",
          flipped && "is-flipped"
        )}
      >
        {/* FRONT — the existing category card design, preserved */}
        <div className="flip-face flex h-full w-full flex-col rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-shadow">
          <h3 className="font-semibold tracking-tight text-base">
            {title}
          </h3>
          <ul className="mt-4 flex flex-wrap content-start gap-x-3 gap-y-2 overflow-hidden">
            {category.skills.map((skill) => (
              <li key={skill.name} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {pick(skill.name, skill.nameEn)}
                </span>
                {skill.level ? (
                  <span className="text-muted-foreground/80">
                    {" "}
                    · {pick(skill.level, skill.levelEn)}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <span className="mt-auto pt-3 text-xs text-primary/80">
            {cubeFaces.length > 0 ? t("cube.hint") : ""}
          </span>
        </div>

        {/* BACK — the cube is the ONLY content: no text, label or caption
            underneath it (per request). Face names sit ON the cube faces.
            Drag the cube to rotate freely; a plain click still flips back. */}
        <div className="flip-face flip-face-back flex h-full w-full flex-col items-center justify-center rounded-xl border border-primary/25 bg-card p-4 shadow-lg">
          {cubeFaces.length > 0 ? (
            <TechCube
              faces={cubeFaces}
              size="clamp(108px, 30vw, 138px)"
              iconSize={26}
              slow
              shadow={false}
            />
          ) : null}
        </div>
      </div>
    </div>
    </TiltCard>
  );
}

/* ------------------------------------------------------------------ */
/* Showcase — centered, balanced flip-card grid (standalone cube gone) */
/* ------------------------------------------------------------------ */

export function SkillsShowcase({
  categories,
}: {
  categories: SkillCategory[];
}) {
  const gridRef = React.useRef<HTMLDivElement>(null);

  /* Pause every mini cube's orbit while the section is off-screen. */
  React.useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.querySelectorAll<HTMLElement>(".cube").forEach((cube) => {
          cube.style.animationPlayState = entry.isIntersecting
            ? "running"
            : "paused";
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className="flex w-full flex-wrap justify-center gap-4 lg:gap-5"
    >
      {categories.map((category) => (
        <TechFlipCard key={category.id} category={category} />
      ))}
    </div>
  );
}
