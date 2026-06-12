import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __orcaPostgresqlPool?: Pool | null;
  __orcaDrizzleDb?: ReturnType<typeof drizzle> | null;
};

function getDatabaseUrl(): string | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn(
      "[orca-db] DATABASE_URL is not set. Database features will be disabled. " +
        "Copy .env.example to .env and set DATABASE_URL to enable."
    );
    return null;
  }
  return databaseUrl;
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export function getPool(): Pool | null {
  if (globalForDb.__orcaPostgresqlPool !== undefined) {
    return globalForDb.__orcaPostgresqlPool;
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    globalForDb.__orcaPostgresqlPool = null;
    return null;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: Number(process.env.PG_POOL_MAX ?? "5"),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  globalForDb.__orcaPostgresqlPool = pool;
  return pool;
}

export function getDb(): ReturnType<typeof drizzle> | null {
  if (globalForDb.__orcaDrizzleDb !== undefined) {
    return globalForDb.__orcaDrizzleDb;
  }

  const pool = getPool();
  if (!pool) {
    globalForDb.__orcaDrizzleDb = null;
    return null;
  }

  const database = drizzle(pool);
  globalForDb.__orcaDrizzleDb = database;
  return database;
}

/**
 * Returns a drizzle db instance or throws with a helpful message.
 * Use in API routes that require the database to function.
 */
export function requireDb(): ReturnType<typeof drizzle> {
  const database = getDb();
  if (!database) {
    throw new Error(
      "DATABASE_URL is not configured. Copy .env.example to .env and set DATABASE_URL."
    );
  }
  return database;
}
