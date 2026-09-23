"use client";

import * as React from "react";
import { Check, Link2, Mail, Send, Share2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/site/primitives";
import { useLang } from "@/lib/lang";

export function ShareButtons({ title }: { title: string }) {
  const { toast } = useToast();
  const { t } = useLang();
  const [copied, setCopied] = React.useState(false);
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: t("share.toastCopied") });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast({ title: t("share.toastFail"), variant: "destructive" });
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: t("share.telegram"),
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
    },
    {
      name: t("share.email"),
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: Mail,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Share2 className="h-4 w-4" />
        {t("share.label")}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={onCopy}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Link2 className="h-3.5 w-3.5" />
        )}
        {copied ? t("share.copied") : t("share.copy")}
      </Button>
      {links.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-input bg-background px-3 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t("share.inAria").replace("{n}", name)}
        >
          <Icon className="h-3.5 w-3.5" />
          {name}
        </a>
      ))}
    </div>
  );
}
