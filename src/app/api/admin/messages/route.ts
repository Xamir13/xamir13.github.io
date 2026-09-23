import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/* Live per-request on server deployments; under static export the build
   bakes an empty inbox (no database exists at build time). */
export const dynamic = "force-static";

const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** List all contact messages, newest first, plus unread stats. */
export async function GET() {
  if (STATIC_EXPORT) {
    return NextResponse.json({ messages: [], total: 0, unread: 0 });
  }
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      messages,
      total: messages.length,
      unread: messages.filter((m) => !m.read).length,
    });
  } catch (error) {
    console.error("[admin-messages] failed:", error);
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}
