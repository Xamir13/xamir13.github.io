"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/lib/lang";

/**
 * Hover-reveal «copy section link» button rendered inside article headings.
 * Copies the full URL (including the heading hash) to the clipboard,
 * syncs the address bar hash without scrolling, and confirms via toast
 * plus a brief check-icon micro-interaction.
 */
export function HeadingAnchor({ id, label }: { id: string; label: string }) {
  const { toast } = useToast();
  const { t } = useLang();
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1800);
      window.history.replaceState(null, "", `#${id}`);
      toast({ title: t("heading.toastCopied") });
    } catch {
      toast({ title: t("heading.toastFail"), variant: "destructive" });
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t("heading.copyAria").replace("{n}", label)}
      title={t("heading.copyTitle")}
      className={`ms-2 inline-flex h-7 w-7 shrink-0 translate-y-0.5 items-center justify-center rounded-md align-middle transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden ${
        copied
          ? "text-primary opacity-100"
          : "text-muted-foreground/60 opacity-0 hover:text-primary focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
      }`}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Link2 className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
