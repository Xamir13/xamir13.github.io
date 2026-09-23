"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang";

/** Floating back-to-top button (article pages) with a circular
 *  scroll-progress ring around it. Appears after ~420px of scrolling;
 *  smooth-scrolls to top. Anchored bottom-start so it never collides
 *  with the TOC sidebar. The ring progress is written straight to the
 *  DOM (ref) so scrolling doesn't re-render the component. */
const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function BackToTop() {
  const { t } = useLang();
  const [visible, setVisible] = React.useState(false);
  const ringRef = React.useRef<SVGCircleElement>(null);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 420);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(
          RING_CIRCUMFERENCE * (1 - progress)
        );
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="fixed bottom-6 start-6 z-40 h-12 w-12 print:hidden"
        >
          {/* Scroll-progress ring (decorative; aria hidden). */}
          <svg
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full -rotate-90"
          >
            <circle
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
              stroke="hsl(var(--primary) / 0.25)"
              strokeWidth="3"
            />
            <circle
              ref={ringRef}
              cx="24"
              cy="24"
              r={RING_RADIUS}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE}
              className="transition-[stroke-dashoffset] duration-150 ease-linear"
            />
          </svg>
          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            aria-label={t("footer.backTop")}
            className={cn(
              "absolute inset-1 flex h-10 w-10 items-center justify-center rounded-full",
              "bg-primary text-primary-foreground",
              "shadow-lg shadow-primary/25",
              "hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "transition-colors"
            )}
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
