"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  Download,
  Flag,
  FlagOff,
  Inbox,
  Loader2,
  MailCheck,
  MailOpen,
  RefreshCcw,
  Search,
  SearchX,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import {
  SectionIndicator,
  SectionTitle,
} from "@/components/site/section-indicator";
import { Button, Card, Input } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  spam: boolean;
  createdAt: string;
};

type ReadFilter = "all" | "unread" | "read" | "spam";

const readFilters: { value: ReadFilter; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "unread", label: "خوانده‌نشده" },
  { value: "read", label: "خوانده‌شده" },
  { value: "spam", label: "هرزنامه" },
];

const faDate = (iso: string) =>
  new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

const faNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as { messages: Message[] };
      setMessages(json.messages);
    } catch {
      setError("بارگذاری پیام‌ها ناموفق بود.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setMessages(
          (prev) =>
            prev?.map((m) => (m.id === id ? { ...m, read: !m.read } : m)) ??
            prev
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function toggleSpam(id: string) {
    const current = messages?.find((m) => m.id === id);
    if (!current) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spam: !current.spam }),
      });
      if (res.ok) {
        setMessages(
          (prev) =>
            prev?.map((m) => (m.id === id ? { ...m, spam: !m.spam } : m)) ??
            prev
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("این پیام برای همیشه حذف شود؟")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      if (res.ok) setMessages((prev) => prev?.filter((m) => m.id !== id) ?? prev);
    } finally {
      setDeletingId(null);
    }
  }

  /* ---- Bulk selection ---- */
  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulk(
    action: "read" | "unread" | "spam" | "unspam" | "delete"
  ) {
    if (selected.size === 0) return;
    if (
      action === "delete" &&
      !window.confirm(
        `${faNum(selected.size)} پیام انتخاب‌شده برای همیشه حذف شود؟`
      )
    )
      return;
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/messages/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: [...selected] }),
      });
      if (res.ok) {
        if (action === "delete") {
          setMessages(
            (prev) => prev?.filter((m) => !selected.has(m.id)) ?? prev
          );
        } else if (action === "spam" || action === "unspam") {
          const spam = action === "spam";
          setMessages(
            (prev) =>
              prev?.map((m) =>
                selected.has(m.id) ? { ...m, spam } : m
              ) ?? prev
          );
        } else {
          setMessages(
            (prev) =>
              prev?.map((m) =>
                selected.has(m.id) ? { ...m, read: action === "read" } : m
              ) ?? prev
          );
        }
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  }

  const total = messages?.length ?? 0;
  const spamCount = messages?.filter((m) => m.spam).length ?? 0;
  const unread = messages?.filter((m) => !m.read && !m.spam).length ?? 0;

  /** Export the currently visible (filtered) messages as UTF-8 CSV (BOM for Excel). */
  function exportCsv() {
    if (!visible || visible.length === 0) return;
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const headers = ["name", "email", "subject", "message", "read", "spam", "createdAt"];
    const rows = visible.map((m) =>
      [
        m.name,
        m.email,
        m.subject,
        m.message,
        m.read ? "read" : "unread",
        m.spam ? "spam" : "ham",
        m.createdAt,
      ]
        .map(esc)
        .join(",")
    );
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visible =
    messages?.filter((m) => {
      if (readFilter === "spam") {
        /* Spam folder view — only flagged messages. */
        if (!m.spam) return false;
      } else {
        /* Inbox views exclude flagged messages. */
        if (m.spam) return false;
        if (readFilter === "unread" && m.read) return false;
        if (readFilter === "read" && !m.read) return false;
      }
      if (!normalizedQuery) return true;
      return [m.name, m.email, m.subject, m.message]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    }) ?? null;

  const visibleIds = (visible ?? []).map((m) => m.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));

  function toggleSelectAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  /* Keep the native checkbox's indeterminate visual in sync. */
  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        someVisibleSelected && !allVisibleSelected;
    }
  }, [someVisibleSelected, allVisibleSelected]);

  return (
    <>
      <Navbar />
      <main id="main-content" className="grow">
        <section className="pt-16 md:pt-24 pb-8 md:pb-16">
          <div className="flex flex-row gap-3 md:gap-6 items-stretch min-h-0">
            <SectionIndicator icon={Inbox} iconSize={28} theme="contact" />
            <div className="flex flex-col gap-3 md:gap-5 min-w-0 flex-1 pb-1">
              <div className="flex flex-col gap-1.5 md:gap-2">
                <SectionTitle text="صندوق پیام‌ها" theme="contact" />
                <p className="text-sm text-muted-foreground">
                  پیام‌های دریافتی از فرم تماس — ابزار داخلی مدیریت.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                    <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
                    کل: {new Intl.NumberFormat("fa-IR").format(total)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                      unread > 0
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/60 bg-card text-muted-foreground"
                    )}
                  >
                    <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    خوانده‌نشده: {new Intl.NumberFormat("fa-IR").format(unread)}
                  </span>
                  {spamCount > 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                        "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}
                    >
                      <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                      هرزنامه: {new Intl.NumberFormat("fa-IR").format(spamCount)}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={load}
                    className="h-8 gap-1.5 text-xs"
                    aria-label="بارگذاری دوباره"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    بارگذاری دوباره
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportCsv}
                    disabled={!visible || visible.length === 0}
                    className="h-8 gap-1.5 text-xs"
                    aria-label="دریافت فایل CSV پیام‌های نمایش‌داده‌شده"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    خروجی CSV
                    {visible !== null && visible.length > 0
                      ? ` (${faNum(visible.length)})`
                      : ""}
                  </Button>
                </div>

                {/* Search + read-state filter */}
                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:max-w-xs">
                    <Search
                      className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="جست‌وجو در نام، ایمیل، موضوع..."
                      aria-label="جست‌وجوی پیام‌ها"
                      className="h-9 bg-card ps-9 text-sm"
                    />
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    role="group"
                    aria-label="فیلتر وضعیت خواندن"
                  >
                    {readFilters.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setReadFilter(f.value)}
                        aria-pressed={readFilter === f.value}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          readFilter === f.value
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  {visibleIds.length > 0 && (
                    <label className="ms-auto flex cursor-pointer items-center gap-1.5 text-xs font-medium text-muted-foreground select-none">
                      <input
                        ref={selectAllRef}
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        aria-label="انتخاب همه پیام‌های نمایش‌داده‌شده"
                        className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-[hsl(var(--primary))]"
                      />
                      انتخاب همه
                    </label>
                  )}
                </div>
              </div>

              {/* States */}
              {messages === null && !error && (
                <div className="flex flex-col gap-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-28 animate-pulse rounded-xl border border-border/50 bg-muted/40"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              {error && (
                <Card className="border-destructive/40 bg-destructive/5 p-6">
                  <p className="text-sm text-destructive">{error}</p>
                </Card>
              )}

              {messages !== null && messages.length === 0 && (
                <Card className="border-dashed border-border/60 bg-card/50 p-10 text-center">
                  <Inbox
                    className="mx-auto h-10 w-10 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm text-muted-foreground">
                    هنوز پیامی دریافت نشده است.
                  </p>
                </Card>
              )}

              {/* Bulk action bar */}
              {selected.size > 0 && (
                <div
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5"
                  role="toolbar"
                  aria-label="عملیات گروهی"
                >
                  <span className="text-xs font-semibold text-primary">
                    {faNum(selected.size)} پیام انتخاب شد
                  </span>
                  <div className="ms-auto flex flex-wrap items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => bulk("read")}
                      disabled={bulkBusy}
                      className="h-8 gap-1.5 text-xs"
                    >
                      {bulkBusy ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : (
                        <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      خوانده‌شده
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => bulk("unread")}
                      disabled={bulkBusy}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      خوانده‌نشده
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => bulk("spam")}
                      disabled={bulkBusy}
                      className="h-8 gap-1.5 text-xs text-amber-600 hover:text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
                    >
                      <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                      هرزنامه
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => bulk("unspam")}
                      disabled={bulkBusy}
                      className="h-8 gap-1.5 text-xs"
                    >
                      <FlagOff className="h-3.5 w-3.5" aria-hidden="true" />
                      غیر هرزنامه
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => bulk("delete")}
                      disabled={bulkBusy}
                      className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      حذف
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelected(new Set())}
                      disabled={bulkBusy}
                      className="h-8 gap-1 px-2 text-xs"
                      aria-label="لغو انتخاب"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Message list */}
              {visible !== null && visible.length > 0 && (
                <ul
                  className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pe-1"
                  aria-label="فهرست پیام‌ها"
                >
                  {visible.map((m) => (
                    <li key={m.id}>
                      <Card
                        className={cn(
                          "p-5 transition-all duration-200",
                          m.spam
                            ? "border-amber-500/40 bg-amber-500/[0.04]"
                            : m.read
                              ? "bg-card border-border/50"
                              : "border-primary/30 bg-primary/[0.04] shadow-sm",
                          selected.has(m.id) &&
                            "border-primary/60 ring-1 ring-primary/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected.has(m.id)}
                            onChange={() => toggleSelect(m.id)}
                            aria-label={`انتخاب پیام از ${m.name}`}
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-[hsl(var(--primary))]"
                          />
                          <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3
                                  className={cn(
                                    "text-base font-semibold tracking-tight",
                                    !m.read && "text-primary"
                                  )}
                                >
                                  {m.name}
                                </h3>
                                {!m.read && !m.spam && (
                                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                                    جدید
                                  </span>
                                )}
                                {m.spam && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    <Flag className="h-2.5 w-2.5" aria-hidden="true" />
                                    هرزنامه
                                  </span>
                                )}
                              </div>
                              <a
                                href={`mailto:${m.email}`}
                                dir="ltr"
                                className="mt-0.5 block truncate text-xs text-muted-foreground hover:text-primary transition-colors"
                              >
                                {m.email}
                              </a>
                            </div>
                            <time className="text-xs text-muted-foreground" dateTime={m.createdAt}>
                              {faDate(m.createdAt)}
                            </time>
                          </div>

                          <p className="mt-2 text-sm font-medium text-foreground/90">
                            {m.subject}
                          </p>
                          <p className="mt-1.5 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                            {m.message}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRead(m.id)}
                              disabled={busyId === m.id || deletingId === m.id}
                              className="h-8 gap-1.5 text-xs"
                            >
                              {busyId === m.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                              ) : m.read ? (
                                <MailCheck className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <MailOpen className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              {m.read ? "علامت‌گذاری خوانده‌نشده" : "علامت‌گذاری خوانده‌شده"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSpam(m.id)}
                              disabled={busyId === m.id || deletingId === m.id}
                              className={cn(
                                "h-8 gap-1.5 text-xs",
                                m.spam &&
                                  "text-amber-600 hover:text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
                              )}
                            >
                              {busyId === m.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                              ) : m.spam ? (
                                <FlagOff className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              {m.spam ? "غیر هرزنامه" : "هرزنامه"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(m.id)}
                              disabled={busyId === m.id || deletingId === m.id}
                              className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {deletingId === m.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              حذف
                            </Button>
                          </div>
                          </div>
                        </div>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}

              {messages !== null && messages.length > 0 && visible !== null && visible.length === 0 && (
                <Card className="border-dashed border-border/60 bg-card/50 p-10 text-center">
                  <SearchX
                    className="mx-auto h-10 w-10 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm text-muted-foreground">
                    هیچ پیامی با این جست‌وجو یا فیلتر پیدا نشد.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
