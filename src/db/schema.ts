import { pgTable, serial, text, timestamp, jsonb, date } from "drizzle-orm/pg-core";

export const dashboardSnapshots = pgTable("dashboard_snapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: date("snapshot_date").notNull().defaultNow(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const marketAlerts = pgTable("market_alerts", {
  id: serial("id").primaryKey(),
  alertType: text("alert_type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
