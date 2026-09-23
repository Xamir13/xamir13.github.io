/**
 * ====================================================================
 * TIGER AI — CHAT STORE (localStorage) + DAILY LIMIT
 * ====================================================================
 * Static-site-friendly persistence: chats and the daily usage counter
 * live in localStorage — no external database, no server. All access is
 * defensive: if storage is unavailable (private mode, quota, disabled),
 * the assistant keeps working from an in-memory mirror and reports the
 * limitation honestly instead of crashing.
 *
 * DAILY LIMIT: 5 user-submitted messages per local calendar day.
 *  • Assistant/greeting messages never count.
 *  • The counter survives refreshes and browser restarts (storage).
 *  • Reset happens automatically when the local date changes.
 *  • HONEST LIMITATION: this is a client-side limit on a static site —
 *    a determined visitor can clear storage or switch browsers/devices.
 *    It is a fair-use guard, not a security boundary.
 * ====================================================================
 */

import type { LinkCard } from "@/lib/ai/knowledge";

export const DAILY_LIMIT = 5;

const CHATS_KEY = "tiger-ai.chats.v1";
const USAGE_KEY = "tiger-ai.usage.v1";

/* Capacity guards keep localStorage healthy without ever surprising the
   user: oldest unpinned chats are dropped beyond the cap. */
const MAX_CHATS = 50;
const MAX_MESSAGES_PER_CHAT = 80;

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  /** Real, code-resolved website links attached to assistant answers. */
  links?: LinkCard[];
  /** Marks a locally generated greeting (never counted, never re-sent). */
  greeting?: boolean;
};

export type Chat = {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

export type Usage = {
  /** Local calendar date "YYYY-MM-DD" the counter belongs to. */
  date: string;
  count: number;
};

/* ------------------------------------------------------------------ */
/* Storage availability (graceful degradation)                        */
/* ------------------------------------------------------------------ */

let storageWorks: boolean | null = null;
let warnedOnce = false;

export function isStorageAvailable(): boolean {
  return storageWorks !== false;
}

function checkStorage(): boolean {
  if (storageWorks !== null) return storageWorks;
  try {
    const probe = "__tiger_ai_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    storageWorks = true;
  } catch {
    storageWorks = false;
    if (!warnedOnce) {
      warnedOnce = true;
      console.warn(
        "[TigerAI] localStorage unavailable — chats and the daily limit will not persist for this visit."
      );
    }
  }
  return storageWorks;
}

function readJSON<T>(key: string): T | null {
  if (!checkStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (err) {
    console.warn(`[TigerAI] failed to read ${key}`, err);
    return null;
  }
}

function writeJSON(key: string, value: unknown): boolean {
  if (!checkStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[TigerAI] failed to write ${key}`, err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Chats                                                              */
/* ------------------------------------------------------------------ */

/** In-memory mirror: source of truth while the page is open, even when
 *  storage is unavailable. Hydrated from storage on first load. */
let memoryChats: Chat[] | null = null;

function trimChats(chats: Chat[]): Chat[] {
  const trimmedMsgs = chats.map((c) => ({
    ...c,
    messages: c.messages.slice(-MAX_MESSAGES_PER_CHAT),
  }));
  if (trimmedMsgs.length <= MAX_CHATS) return trimmedMsgs;
  const keepPinned = trimmedMsgs.filter((c) => c.pinned);
  const unpinned = trimmedMsgs.filter((c) => !c.pinned);
  const overflow = trimmedMsgs.length - MAX_CHATS;
  const dropIds = new Set(
    unpinned
      .sort((a, b) => a.updatedAt - b.updatedAt)
      .slice(0, overflow)
      .map((c) => c.id)
  );
  return [...keepPinned, ...unpinned.filter((c) => !dropIds.has(c.id))];
}

export function loadChats(): Chat[] {
  if (memoryChats) return memoryChats;
  const stored = readJSON<Chat[]>(CHATS_KEY);
  memoryChats = Array.isArray(stored) ? stored.filter((c) => c && c.id && Array.isArray(c.messages)) : [];
  return memoryChats;
}

export function saveChats(chats: Chat[]): void {
  const capped = trimChats(chats);
  memoryChats = capped;
  writeJSON(CHATS_KEY, capped);
}

/* ------------------------------------------------------------------ */
/* Daily usage                                                        */
/* ------------------------------------------------------------------ */

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

let memoryUsage: Usage | null = null;

export function getUsage(): Usage {
  if (memoryUsage) return memoryUsage;
  const stored = readJSON<Usage>(USAGE_KEY);
  const today = localDateKey();
  if (stored && stored.date === today && typeof stored.count === "number") {
    memoryUsage = stored;
  } else {
    memoryUsage = { date: today, count: 0 };
  }
  return memoryUsage;
}

export function remainingToday(): number {
  return Math.max(0, DAILY_LIMIT - getUsage().count);
}

/** Count one user-submitted message (assistant messages never counted).
 *  Rolls over automatically when the local date has changed. */
export function consumeMessage(): Usage {
  const today = localDateKey();
  const current = getUsage();
  const next: Usage =
    current.date === today
      ? { date: today, count: current.count + 1 }
      : { date: today, count: 1 };
  memoryUsage = next;
  writeJSON(USAGE_KEY, next);
  return next;
}

/** Next reset = upcoming local midnight (calculable reliably). */
export function nextResetDate(): Date {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(24, 0, 0, 0);
  return reset;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export function uid(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function makeTitle(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "گفت‌وگوی جدید";
  return clean.length <= 46 ? clean : `${clean.slice(0, 46).trimEnd()}…`;
}

export function sortChats(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
}
