"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Mail, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLang } from "@/lib/lang";
import { footerLinks, profile, socials } from "@/lib/site-data";
import { resolveSectionHref } from "@/lib/nav";

function useJalaliYear() {
  const [year, setYear] = React.useState<string>("");
  React.useEffect(() => {
    try {
      setYear(
        new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())
      );
    } catch {
      setYear("۱۴۰۴");
    }
  }, []);
  return year;
}

function useLatinYear() {
  const [year, setYear] = React.useState<string>("");
  React.useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);
  return year;
}

export function Footer() {
  const { lang, t, pick } = useLang();
  const pathname = usePathname();
  const jalaliYear = useJalaliYear();
  const latinYear = useLatinYear();
  const year = lang === "fa" ? jalaliYear : latinYear;

  return (
    <footer
      className={cn(
        "relative w-full mt-12 md:mt-16",
        "bg-zinc-50/80 dark:bg-zinc-900/60",
        "animated-border-top"
      )}
    >
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "animated-button-border",
            "flex items-center justify-center w-10 h-10 rounded-full",
            "bg-primary text-primary-foreground",
            "shadow-md hover:shadow-lg hover:-translate-y-0.5",
            "active:scale-95 transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          aria-label={t("footer.backTop")}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-2 text-center sm:text-start">
            <Link
              href={resolveSectionHref("#hero", pathname)}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors w-fit mx-auto sm:mx-0"
            >
              {pick(profile.fullName, profile.fullNameEn)}
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm mx-auto sm:mx-0">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-1 justify-center sm:justify-start mt-1">
              {socials.map(({ id, name, nameEn, url, icon: Icon }) => (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg",
                    "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-ring"
                  )}
                  aria-label={pick(name, nameEn)}
                  title={pick(name, nameEn)}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav
            className="flex flex-col gap-3 text-center sm:text-start"
            aria-label={t("footer.quickAria")}
          >
            <span className="text-sm font-medium text-foreground">{t("footer.quick")}</span>
            <ul className="flex flex-col justify-center sm:justify-start gap-y-2">
              {footerLinks.map(({ href, label, labelEn }) => (
                <li key={label}>
                  <Link
                    href={resolveSectionHref(href, pathname)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {pick(label, labelEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Direct contact */}
          <div className="flex flex-col gap-3 text-center sm:text-start lg:items-start">
            <span className="text-sm font-medium text-foreground">{t("footer.direct")}</span>
            <a
              href={`tel:+98${profile.phone.slice(1)}`}
              className={cn(
                "inline-flex items-center gap-2.5 w-fit mx-auto sm:mx-0",
                "rounded-lg border border-border/60 bg-card px-3 py-2",
                "text-sm font-medium text-foreground",
                "transition-colors hover:border-primary/40 hover:text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-ring"
              )}
              aria-label={`${t("footer.call")}: ${profile.phone}`}
              title={t("footer.call")}
            >
              <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
              <span dir="ltr">{profile.phone}</span>
            </a>
            <a
              href={`mailto:${profile.email}`}
              className={cn(
                "inline-flex items-center gap-2.5 w-fit mx-auto sm:mx-0",
                "text-sm text-muted-foreground hover:text-foreground transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              )}
              aria-label={`${t("footer.email")}: ${profile.email}`}
              title={t("footer.email")}
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span dir="ltr">{profile.email}</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            © {year} {pick(profile.fullName, profile.fullNameEn)}. {t("footer.rights")}
          </span>
          <span className="flex items-center gap-1">
            {t("footer.made")}{" "}
            <span className="text-sm leading-none" role="img" aria-label="قلب سبز">
              💚
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
