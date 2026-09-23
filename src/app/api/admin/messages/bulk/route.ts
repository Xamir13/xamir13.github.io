import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

/* POST handlers are never prerendered; dropping force-dynamic keeps the
   static export build happy without changing runtime behavior. */

const bulkSchema = z.object({
  action: z.enum(["read", "unread", "spam", "unspam", "delete"]),
  ids: z.array(z.string().min(1)).min(1).max(500),
});

/**
 * Bulk operations over contact messages:
 *   action=read   → mark all given ids as read
 *   action=unread → mark all given ids as unread
 *   action=spam   → flag all given ids as spam
 *   action=unspam → clear the spam flag on all given ids
 *   action=delete → remove all given ids
 * Returns the number of affected rows.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bulkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    const { action, ids } = parsed.data;

    if (action === "delete") {
      const result = await db.contactMessage.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ affected: result.count });
    }

    const data =
      action === "spam" || action === "unspam"
        ? { spam: action === "spam" }
        : { read: action === "read" };

    const result = await db.contactMessage.updateMany({
      where: { id: { in: ids } },
      data,
    });
    return NextResponse.json({ affected: result.count });
  } catch (error) {
    console.error("[admin-messages-bulk] failed:", error);
    return NextResponse.json({ error: "خطای سرور." }, { status: 500 });
  }
}
