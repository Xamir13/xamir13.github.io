"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/lang";

/* Localized display labels for fenced-code languages (identity for
   well-known Latin names, translated for generic ones). */
const CODE_LANG_LABELS: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  bash: "code.terminal",
  sh: "code.terminal",
  shell: "code.terminal",
  py: "Python",
  python: "Python",
  sql: "SQL",
  prisma: "Prisma",
  dockerfile: "Dockerfile",
  text: "code.text",
};

/**
 * Wraps a markdown <pre> block with a hover-revealed copy button and an
 * optional language label chip.
 * Keeps the original <pre> markup/classes intact (frontend untouched).
 * `lang` is the raw fenced-code id; the display label is resolved here so
 * it follows the active language.
 */
export function CodeBlock({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang?: string | null;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useLang();

  const label = lang
    ? CODE_LANG_LABELS[lang]
      ? CODE_LANG_LABELS[lang].startsWith("code.")
        ? t(CODE_LANG_LABELS[lang])
        : CODE_LANG_LABELS[lang]
      : lang.toUpperCase()
    : null;

  async function handleCopy() {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ description: t("code.toastCopied") });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ description: t("code.toastFail"), variant: "destructive" });
    }
  }

  return (
    <div className="group/code relative">
      {label ? (
        <span
          className="pointer-events-none absolute start-3 top-2.5 z-10 select-none rounded-md border border-border/40 bg-muted/70 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground/90 backdrop-blur"
          aria-hidden="true"
        >
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("code.copyAria")}
        className={cn(
          "code-copy-btn absolute end-2 top-2 z-10 inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-background/90 px-2 text-xs text-muted-foreground shadow-sm backdrop-blur transition-all",
          "opacity-0 group-hover/code:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "hover:border-primary/40 hover:text-primary"
        )}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {copied ? t("code.copied") : t("code.copy")}
      </button>
      {children}
    </div>
  );
}
