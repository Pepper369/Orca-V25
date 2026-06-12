import { NextResponse } from "next/server";
import { getLatestDashboardData, maybeRunDueUpdate } from "@/lib/dashboard-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const auto = url.searchParams.get("auto") === "1";

    if (auto) {
      await maybeRunDueUpdate();
    }

    const data = await getLatestDashboardData();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
