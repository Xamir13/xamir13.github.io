"use client";

import * as React from "react";
import {
  SiGraphql,
  SiJavascript,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
} from "react-icons/si";
import { Network } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang";
import { DepthRegion } from "@/components/site/depth-region";

/* ====================================================================
   TECH RUSH — fast, seamless brand-logo ticker

   • The exact stack represented in this project's skill data.
   • Two rows moving in opposite directions at different speeds with
     different item treatments → layered depth without clutter.
   • Seamless loop: each track renders its items exactly twice and the
     CSS animation translates by -50%; spacing uses margin (not flex
     gap) so both halves are pixel-identical — no jump on wrap.
   • Hover on an item lifts it (scale/translate + green glow) while
     its row pauses so it stays readable — hover-capable pointers only
     (a touch tap can never leave a row stuck paused or an item stuck
     lifted; see the @media (hover: hover) scoping in globals.css).
   • Pure CSS animation (compositor-only); paused off-screen via
     IntersectionObserver; static under prefers-reduced-motion.
   ==================================================================== */

type Tech = { name: string; Icon: React.ComponentType<{ size?: number | string; className?: string }> };

const ROW_A: Tech[] = [
  { name: "JavaScript", Icon: SiJavascript },
  { name: "React.js", Icon: SiReact },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "NestJS", Icon: SiNestjs },
  { name: "PostgreSQL", Icon: SiPostgresql },
];

const ROW_B: Tech[] = [
  { name: "MongoDB", Icon: SiMongodb },
  { name: "Redis", Icon: SiRedis },
  { name: "Python", Icon: SiPython },
  { name: "REST API", Icon: Network }, /* no brand mark — clean protocol glyph */
  { name: "GraphQL", Icon: SiGraphql },
];

function MarqueeRow({
  items,
  duration,
  reverse = false,
}: {
  items: Tech[];
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div
      className="tech-marquee"
      style={{ "--marquee-dur": duration } as React.CSSProperties}
    >
      <div
        className={cn("tech-marquee-track items-stretch", reverse && "is-reverse")}
      >
        {/* Two identical halves → translateX(-50%) wraps seamlessly. */}
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex shrink-0"
            aria-hidden={half === 1 ? "true" : undefined}
          >
            {items.map(({ name, Icon }, i) => (
              <div
                key={`${half}-${name}-${i}`}
                className="tech-item mx-2.5 md:mx-3"
                tabIndex={half === 1 ? -1 : undefined}
              >
                <Icon size={22} className="shrink-0 text-primary" />
                <span
                  dir="ltr"
                  className="whitespace-nowrap text-sm font-medium text-foreground/90"
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechRush() {
  const { t } = useLang();
  /* Pause the CSS animations while the section is off-screen. */
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.style.setProperty(
          "--marquee-play",
          entry.isIntersecting ? "running" : "paused"
        );
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="tech-marquee-root relative mx-auto w-full max-w-6xl overflow-x-clip px-3 py-10 sm:px-4 md:py-12"
      style={{ "--marquee-play": "running" } as React.CSSProperties}
      aria-label={t("tech.aria")}
    >
      {/* The whole ticker sits on its own receding depth plane. */}
      <DepthRegion
        shift={12}
        recede={0.022}
        tilt={1.4}
        push={-18}
        backdropClassName="-inset-x-8 -inset-y-6"
        backdrop={
          <div className="absolute inset-0 rounded-[2.5rem] bg-primary/[0.06] blur-3xl dark:bg-primary/[0.11]" />
        }
      >
        <p className="mb-6 text-center text-sm font-medium tracking-wide text-muted-foreground">
          {t("tech.caption")}
        </p>
        <style>{`.tech-marquee-root .tech-marquee-track { animation-play-state: var(--marquee-play); }`}</style>
        <div className="flex flex-col gap-4">
          <MarqueeRow items={ROW_A} duration="26s" />
          <MarqueeRow items={ROW_B} duration="34s" reverse />
        </div>
      </DepthRegion>
    </div>
  );
}
