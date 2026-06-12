import { getDb, isDatabaseAvailable } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!isDatabaseAvailable()) {
    return Response.json(
      {
        ok: true,
        database: "disabled",
        message: "DATABASE_URL is not configured. Serving bundled dashboard data.",
      },
      { status: 200 }
    );
  }

  const database = getDb();
  if (!database) {
    return Response.json({ ok: false, database: "unavailable" }, { status: 503 });
  }

  try {
    await database.execute(sql`select 1`);
    return Response.json({ ok: true, database: "connected" });
  } catch (error) {
    console.error("Healthcheck failed:", error);
    return Response.json({ ok: false, database: "error" }, { status: 500 });
  }
}
