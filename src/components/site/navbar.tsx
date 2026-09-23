"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang";
import { navItems, profile } from "@/lib/site-data";
import { resolveSectionHref } from "@/lib/nav";
import { Button } from "@/components/site/primitives";

/* Exact logo artwork from the reference frontend — do not modify.
 * The reference tiger has TWO expressions: happy while the menu is
 * expanded, and sad (drooping ears, closed eyes, frown) once collapsed.
 * The swap is a plain conditional render, exactly like the reference. */
const TIGER_HAPPY_PATHS = [
  "M24.8812 34.0824C29.0151 33.5388 33.4551 33.6049 37.2913 34.2249",
  "M27.6223 35.8803C27.9457 35.316 27.6063 34.8277 27.5298 34.3036",
  "M34.001 35.6928C34.001 35.2173 34.001 34.7417 34.001 34.2669",
  "M25.0277 25.4634C25.2038 24.6046 24.9376 23.5765 24.8636 22.8409",
  "M30.4369 26.5959C30.463 24.7992 30.4369 22.9862 30.4369 21.1793",
  "M35.3175 24.714C35.2623 23.7142 35.2357 22.7194 35.2357 21.717",
  "M13.711 23.0379C6.31812 16.4483 15.6835 16.2084 19.567 22.2747",
  "M41.2186 20.9343C43.987 12.7579 50.7345 16.204 45.2539 23.4598",
  "M30.9719 39.5326C33.9917 38.5893 32.7125 42.0789 30.6456 39.3727",
  "M31.5566 41.5395C30.4485 43.0707 29.804 43.2795 28.8278 43.65",
  "M32.1766 41.9643C32.664 43.0678 33.4639 42.9976 34.245 43.2754",
  "M17.9242 36.5148C15.7356 36.2743 12.8594 36.1804 10.9672 35.9529",
  "M18.0792 40.7082C16.1318 41.3868 14.212 42.1383 12.2502 42.7686",
  "M48.6576 34.2789C46.6913 34.7465 44.8343 35.6373 43.0167 36.5267",
  "M49.2 40.4711C47.4059 40.3325 45.5718 40.2446 43.0167 40.4111",
];

const TIGER_SAD_PATHS = [
  "M15.7262 21.8638C12.6574 15.486 17.0964 14.084 20.7093 19.0153",
  "M41.7675 18.8505C46.5027 12.8896 47.4687 18.5227 45.9547 23.4532",
  "M26.1223 22.4832C26.1718 21.7063 26.2218 20.9311 26.2713 20.1561",
  "M31.2878 23.4516C31.2342 21.963 31.4145 20.4716 31.5861 18.9944",
  "M36.2037 22.4826C36.4608 21.7356 36.3032 20.9318 36.3533 20.1567",
  "M24.6174 29.8205C30.761 29.7357 29.5232 31.523 24.2792 33.4995",
  "M35.6766 29.653C30.5421 31.9063 31.5819 30.9621 35.5046 33.5289",
  "M29.533 38.18C26.9918 38.3208 29.3291 41.0501 31.5292 38.3469",
  "M29.0084 42.9963C27.274 43.7517 26.3837 43.4257 25.1305 42.4434",
  "M29.5902 42.4434C30.9627 44.6142 33.1404 43.8501 34.8257 42.4434",
  "M16.4049 34.6917C14.5177 34.6682 11.4228 34.0811 10.2 33.9165",
  "M16.7927 38.5278C14.4105 38.6412 12.3172 39.1701 10.3939 40.0773",
  "M49.9499 32.1335C47.4247 32.4045 45.3305 33.0308 43.3573 34.3061",
  "M49.7947 39.3672C47.755 38.8312 45.702 38.7858 43.5898 38.7858",
];

export function LogoMark({ size = 36, sad = false }: { size?: number; sad?: boolean }) {
  const paths = sad ? TIGER_SAD_PATHS : TIGER_HAPPY_PATHS;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeOpacity="0.9"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

function ThemeToggle() {
  const { setTheme } = useTheme();
  const { t } = useLang();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="icon" type="button" aria-label={t("nav.themeAria")}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t("nav.themeAria")}</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
        >
          <DropdownMenu.Item
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => setTheme("light")}
          >
            {t("theme.light")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => setTheme("dark")}
          >
            {t("theme.dark")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => setTheme("system")}
          >
            {t("theme.system")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { t, pick } = useLang();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const lastScrollY = React.useRef(0);
  const collapsedRef = React.useRef(false);

  React.useEffect(() => {
    collapsedRef.current = collapsed;
  }, [collapsed]);

  React.useEffect(() => {
    const onScroll = () => {
      const y =
        typeof window.scrollY !== "undefined"
          ? window.scrollY
          : document.documentElement?.scrollTop ?? 0;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;
      if (Math.abs(delta) < 12) return;
      if (delta > 0) {
        if (!collapsedRef.current) setCollapsed(true);
      } else {
        if (collapsedRef.current) setCollapsed(false);
      }
    };
    lastScrollY.current =
      typeof window.scrollY !== "undefined"
        ? window.scrollY
        : document.documentElement?.scrollTop ?? 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (collapsed) setMobileOpen(false);
  }, [collapsed]);

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const expanded = !collapsed;

  return (
    <header className="fixed top-0 start-0 z-20 p-4 md:p-6">
      <nav
        className={cn(
          "relative min-w-0 overflow-visible",
          "bg-white/85 dark:bg-zinc-900/85",
          "backdrop-blur-xl border border-border/40",
          "shadow-xl shadow-black/5 dark:shadow-zinc-950/40",
          "transition-colors duration-300",
          "rounded-2xl transition-[width] duration-300 ease-out",
          collapsed ? "w-14 mx-auto" : "w-full",
          mobileOpen && "max-md:rounded-b-none max-md:border-b-0"
        )}
        aria-label="Main"
      >
        <div
          className={cn(
            "flex items-center min-w-0 overflow-hidden",
            "h-14",
            collapsed
              ? "justify-center items-center gap-0 px-0"
              : "gap-4 px-4 md:px-6"
          )}
        >
          <button
            type="button"
            onClick={() => {
              setCollapsed((c) => !c);
              if (!collapsed) setMobileOpen(false);
            }}
            className={cn(
              "flex items-center shrink-0 rounded-lg outline-none text-foreground",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "transition-transform duration-200 hover:scale-105 active:scale-95",
              collapsed ? "p-2 justify-center w-full min-w-0" : "gap-2 py-1"
            )}
            aria-expanded={expanded}
            aria-label={expanded ? t("nav.menuClose") : t("nav.menuOpen")}
          >
            <LogoMark size={36} sad={collapsed} />
            <span
              className={cn(
                "hidden text-sm font-medium text-foreground truncate sm:block",
                "transition-opacity duration-200",
                collapsed ? "w-0 overflow-hidden opacity-0" : "opacity-100"
              )}
            >
              {/* Language-aware site name: امیرعلی (fa) / AmirAli (en). */}
              {pick(profile.username, profile.usernameEn)}
            </span>
          </button>

          <ul
            className={cn(
              "hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center min-w-0",
              "transition-opacity duration-200",
              collapsed
                ? "opacity-0 w-0 min-w-0 overflow-hidden pointer-events-none"
                : "opacity-100"
            )}
          >
            {navItems.map(({ href, label, labelEn, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={resolveSectionHref(href, pathname)}
                  className={cn(
                    "group flex items-center gap-1.5 py-2 px-3 rounded-lg whitespace-nowrap",
                    "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "transition-colors duration-200"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{pick(label, labelEn)}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={cn(
              "flex items-center gap-2 shrink-0 min-w-0",
              "transition-opacity duration-200",
              collapsed
                ? "opacity-0 w-0 min-w-0 overflow-hidden pointer-events-none"
                : "opacity-100"
            )}
          >
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className={cn(
                "flex md:hidden items-center justify-center w-10 h-10 rounded-lg",
                "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-colors duration-200"
              )}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t("nav.menuClose") : t("nav.menuOpen")}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <ThemeToggle />
          </div>
        </div>

        <div
          className={cn(
            "absolute top-full left-0 right-0 z-10 md:hidden",
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            "rounded-b-2xl border-x border-b border-border/40",
            "bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl",
            "shadow-lg shadow-black/5 dark:shadow-zinc-950/40",
            mobileOpen ? "max-h-[min(70vh,28rem)] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <ul className="flex flex-col gap-0.5 px-2 py-3">
            {navItems.map(({ href, label, labelEn, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={resolveSectionHref(href, pathname)}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-2 py-2.5 px-3 rounded-lg",
                    "text-muted-foreground hover:text-foreground hover:bg-accent/30",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "transition-colors duration-200"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{pick(label, labelEn)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
