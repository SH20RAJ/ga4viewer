import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllAnalytics } from "@/lib/ga/analytics";
import { getCachedAnalytics, setCachedAnalytics } from "@/lib/cache/redis";
import { generateInsights } from "@/lib/insights/engine";
import type { DateRange } from "@/lib/ga/analytics";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get("propertyId");
  const dateRange = (searchParams.get("dateRange") as DateRange) ?? "7daysAgo";

  if (!propertyId) {
    return NextResponse.json({ error: "propertyId is required" }, { status: 400 });
  }

  const userId = session.user.id;

  const cached = await getCachedAnalytics(userId, propertyId, dateRange);
  if (cached) {
    return NextResponse.json(cached);
  }

  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
    select: { access_token: true },
  });

  if (!account?.access_token) {
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  try {
    const current = await getAllAnalytics(propertyId, account.access_token, dateRange);

    const prevRange: DateRange = dateRange === "today" ? "yesterday" : "30daysAgo";
    const previous = await getAllAnalytics(propertyId, account.access_token, prevRange).catch(
      () => current
    );

    const insights = generateInsights(current, previous);
    const result = { ...current, insights };

    await setCachedAnalytics(userId, propertyId, dateRange, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
