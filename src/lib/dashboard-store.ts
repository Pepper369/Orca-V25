import { desc, eq, sql } from "drizzle-orm";
import { getDb, isDatabaseAvailable, requireDb } from "@/db";
import { dashboardSnapshots, marketAlerts } from "@/db/schema";
import { getDashboardData, type DashboardData, type MarketIndex, type Commodity, type NewsItem } from "@/lib/dashboard-data";

const VN_TIME_ZONE = "Asia/Ho_Chi_Minh";
const HOURLY_UPDATE_INTERVAL_MINUTES = 60;
const MIN_UPDATE_INTERVAL_MINUTES = Number(process.env.MIN_UPDATE_INTERVAL_MINUTES ?? "50");

type QuoteResult = {
  symbol: string;
  price: number;
  previousClose?: number;
  change?: number;
  changePct?: number;
  asOf: string;
};

type UpdateTrigger = "cron" | "on-demand" | "manual";

export type DailyUpdateResult = {
  ok: boolean;
  dateKey: string;
  skipped: boolean;
  trigger: UpdateTrigger;
  message: string;
  snapshotId?: number;
  quoteCount: number;
  newsCount: number;
  data: DashboardData;
};

let tablesEnsured = false;

async function ensureDashboardTables() {
  if (!isDatabaseAvailable()) return;
  if (tablesEnsured) return;
  const database = requireDb();

  await database.execute(sql`
    create table if not exists dashboard_snapshots (
      id serial primary key,
      snapshot_date date not null default current_date,
      data jsonb not null,
      created_at timestamp not null default now()
    )
  `);

  await database.execute(sql`
    create index if not exists dashboard_snapshots_snapshot_date_created_at_idx
    on dashboard_snapshots (snapshot_date desc, created_at desc)
  `);

  await database.execute(sql`
    create table if not exists market_alerts (
      id serial primary key,
      alert_type text not null,
      title text not null,
      message text not null,
      severity text not null,
      created_at timestamp not null default now()
    )
  `);

  tablesEnsured = true;
}

export function getVietnamDateKey(date = new Date()) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: VN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const map = Object.fromEntries(p.map((x) => [x.type, x.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function getVietnamDateShort(date = new Date()) {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: VN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const map = Object.fromEntries(p.map((x) => [x.type, x.value]));
  return `${map.day}/${map.month}/${map.year}`;
}

export function getVietnamTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VN_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getVietnamReportDate(date = new Date()) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: VN_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getHourlyUpdateIntervalMinutes() {
  return HOURLY_UPDATE_INTERVAL_MINUTES;
}

function parseDateShort(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return 0;
  return Number(`${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`);
}

async function getLatestSnapshotMeta() {
  if (!isDatabaseAvailable()) return null;
  const database = getDb();
  if (!database) return null;

  const rows = await database
    .select({
      id: dashboardSnapshots.id,
      snapshotDate: dashboardSnapshots.snapshotDate,
      createdAt: dashboardSnapshots.createdAt,
      data: dashboardSnapshots.data,
    })
    .from(dashboardSnapshots)
    .orderBy(desc(dashboardSnapshots.createdAt))
    .limit(1);

  return rows[0] ?? null;
}

function getSnapshotAgeMs(createdAt: Date | string | null | undefined) {
  if (!createdAt) return Number.POSITIVE_INFINITY;
  const time = createdAt instanceof Date ? createdAt.getTime() : new Date(createdAt).getTime();
  if (Number.isNaN(time)) return Number.POSITIVE_INFINITY;
  return Date.now() - time;
}

async function hasFreshSnapshot() {
  if (!isDatabaseAvailable()) return false;
  const latest = await getLatestSnapshotMeta();
  if (!latest) return false;
  return getSnapshotAgeMs(latest.createdAt) < MIN_UPDATE_INTERVAL_MINUTES * 60_000;
}

async function fetchJsonWithTimeout<T>(url: string, timeoutMs = 8000): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "ORCA-FINANCIAL-Dashboard/1.0",
        accept: "application/json,text/plain,*/*",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.warn("Quote fetch failed:", url, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchTextWithTimeout(url: string, timeoutMs = 8000): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "ORCA-FINANCIAL-Dashboard/1.0",
        accept: "application/rss+xml,text/xml,text/plain,*/*",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (error) {
    console.warn("RSS fetch failed:", url, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchYahooQuote(symbol: string): Promise<QuoteResult | null> {
  type YahooChartResponse = {
    chart?: {
      result?: Array<{
        meta?: {
          regularMarketPrice?: number;
          chartPreviousClose?: number;
          previousClose?: number;
          regularMarketTime?: number;
        };
        indicators?: { quote?: Array<{ close?: Array<number | null> }> };
      }>;
    };
  };

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
  const json = await fetchJsonWithTimeout<YahooChartResponse>(url);
  const result = json?.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta?.regularMarketPrice) return null;

  const closes = result?.indicators?.quote?.[0]?.close?.filter((v): v is number => typeof v === "number") ?? [];
  const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? closes.at(-2);
  const price = meta.regularMarketPrice;
  const change = previousClose ? price - previousClose : undefined;
  const changePct = previousClose ? (change! / previousClose) * 100 : undefined;
  const asOf = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : new Date().toISOString();

  return { symbol, price, previousClose, change, changePct, asOf };
}

function decodeXml(input: string) {
  return input
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

async function fetchGoogleNewsItems(query: string, category: "global" | "vietnam", limit = 2): Promise<NewsItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=vi&gl=VN&ceid=VN:vi`;
  const xml = await fetchTextWithTimeout(url);
  if (!xml) return [];

  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit);
  return itemMatches.map((match) => {
    const block = match[1];
    const title = decodeXml(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Tin thị trường mới");
    const source = decodeXml(block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "Google News");
    const pubDate = decodeXml(block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? getVietnamTimestamp());
    const impact = title.match(/CPI|Fed|lãi suất|VN-Index|Nasdaq|dầu|vàng|tỷ giá/i) ? "high" : "medium";
    return {
      headline: title,
      source: `Google News RSS / ${source}`,
      time: pubDate,
      summary: `Tin được hệ thống ORCA tự động quét theo truy vấn: "${query}". Vui lòng đọc chi tiết từ nguồn gốc trước khi ra quyết định đầu tư.`,
      impact,
      riskLevel: impact === "high" ? "Cao" : "Trung bình",
      sectors: category === "vietnam" ? ["Toàn thị trường", "Việt Nam"] : ["Toàn cầu", "Vĩ mô"],
      verified: true,
    } satisfies NewsItem;
  });
}

function updateMarketIndex(markets: MarketIndex[], name: string, quote: QuoteResult | null): MarketIndex[] {
  if (quote === null || quote.changePct === undefined || quote.change === undefined) return markets;
  const change = quote.change;
  const changePct = quote.changePct;
  return markets.map((m) =>
    m.name === name
      ? {
          ...m,
          value: Number(quote.price.toFixed(2)),
          dailyChange: Number(change.toFixed(2)),
          dailyChangePct: Number(changePct.toFixed(2)),
          trend: changePct > 0.3 ? "bullish" : changePct < -0.3 ? "bearish" : "neutral",
        }
      : m
  );
}

function updateCommodity(commodities: Commodity[], name: string, quote: QuoteResult | null, source: string): Commodity[] {
  if (quote === null || quote.changePct === undefined || quote.change === undefined) return commodities;
  const changePct = quote.changePct;
  return commodities.map((c) =>
    c.name === name
      ? {
          ...c,
          price: Number(quote.price.toFixed(2)),
          dailyChange: Number(changePct.toFixed(2)),
          weeklyTrend: changePct > 0 ? "up" : changePct < 0 ? "down" : "flat",
          source,
          asOf: getVietnamDateShort(),
        }
      : c
  );
}

function setAutoDateFields(data: DashboardData, trigger: UpdateTrigger): DashboardData {
  const now = new Date();
  return {
    ...data,
    date: getVietnamReportDate(now),
    dateShort: getVietnamDateShort(now),
    timestamp: `Tự động quét mỗi 1 giờ | ${getVietnamTimestamp(now)} (GMT+7) | Trigger: ${trigger}`,
  };
}

async function buildAutoDashboardData(trigger: UpdateTrigger): Promise<{ data: DashboardData; quoteCount: number; newsCount: number }> {
  let data: DashboardData = JSON.parse(JSON.stringify(getDashboardData())) as DashboardData;
  data = setAutoDateFields(data, trigger);

  const quoteEntries = await Promise.all([
    fetchYahooQuote("^GSPC"),
    fetchYahooQuote("^IXIC"),
    fetchYahooQuote("^DJI"),
    fetchYahooQuote("^RUT"),
    fetchYahooQuote("^VNINDEX.VN"),
    fetchYahooQuote("BZ=F"),
    fetchYahooQuote("CL=F"),
    fetchYahooQuote("GC=F"),
    fetchYahooQuote("SI=F"),
    fetchYahooQuote("BTC-USD"),
  ]);

  const [spx, nasdaq, dow, rut, vnindex, brent, wti, gold, silver] = quoteEntries;
  const quoteCount = quoteEntries.filter(Boolean).length;

  data.globalMarkets = updateMarketIndex(data.globalMarkets, "S&P 500", spx);
  data.globalMarkets = updateMarketIndex(data.globalMarkets, "NASDAQ", nasdaq);
  data.globalMarkets = updateMarketIndex(data.globalMarkets, "DOW JONES", dow);
  data.globalMarkets = updateMarketIndex(data.globalMarkets, "Russell 2000", rut);
  data.vietnamMarkets = updateMarketIndex(data.vietnamMarkets, "VNINDEX", vnindex);

  data.commodities = updateCommodity(data.commodities, "Dầu Brent", brent, "Yahoo Finance / Auto scan");
  data.commodities = updateCommodity(data.commodities, "Dầu WTI", wti, "Yahoo Finance / Auto scan");
  data.commodities = updateCommodity(data.commodities, "Vàng spot", gold, "Yahoo Finance / Auto scan");
  data.commodities = updateCommodity(data.commodities, "Bạc", silver, "Yahoo Finance / Auto scan");

  const [vnNews, globalNews, commodityNews] = await Promise.all([
    fetchGoogleNewsItems("VN-Index chứng khoán Việt Nam hôm nay", "vietnam", 2),
    fetchGoogleNewsItems("S&P 500 Nasdaq Fed CPI market today", "global", 2),
    fetchGoogleNewsItems("Brent oil gold dollar treasury yield today", "global", 1),
  ]);
  const autoNews = [...globalNews, ...commodityNews];
  const newsCount = autoNews.length + vnNews.length;

  if (autoNews.length > 0) data.globalNews = [...autoNews, ...data.globalNews].slice(0, 12);
  if (vnNews.length > 0) data.vietnamNews = [...vnNews, ...data.vietnamNews].slice(0, 10);

  const riskNote = `Hệ thống đã tự động quét ${quoteCount} mã thị trường và ${newsCount} tin RSS theo lịch mỗi 1 giờ. Nếu dữ liệu nguồn công khai lỗi, dashboard giữ dữ liệu phân tích gần nhất làm fallback.`;
  data.confidenceScores = {
    ...data.confidenceScores,
    dataReliability: Math.min(95, Math.max(data.confidenceScores.dataReliability, quoteCount >= 6 ? 92 : 84)),
    explanation: `${riskNote} ${data.confidenceScores.explanation}`,
  };

  return { data, quoteCount, newsCount };
}

export async function getLatestDashboardData(): Promise<DashboardData> {
  const fallback = getDashboardData();

  if (!isDatabaseAvailable()) {
    console.info("[orca] No DATABASE_URL configured. Serving bundled dashboard data.");
    return fallback;
  }

  try {
    await ensureDashboardTables();
    const database = getDb();
    if (!database) return fallback;

    const rows = await database
      .select()
      .from(dashboardSnapshots)
      .orderBy(desc(dashboardSnapshots.snapshotDate), desc(dashboardSnapshots.createdAt))
      .limit(1);
    const latest = rows[0];
    if (!latest?.data) return fallback;

    const latestData = latest.data as DashboardData;
    const latestRank = parseDateShort(latestData.dateShort);
    const fallbackRank = parseDateShort(fallback.dateShort);
    return latestRank >= fallbackRank ? latestData : fallback;
  } catch (error) {
    console.warn("Could not read dashboard snapshot, using bundled fallback:", error);
    return fallback;
  }
}

export async function hasSnapshotForDate(dateKey = getVietnamDateKey()): Promise<boolean> {
  if (!isDatabaseAvailable()) return false;
  try {
    await ensureDashboardTables();
    const database = getDb();
    if (!database) return false;
    const rows = await database
      .select({ id: dashboardSnapshots.id })
      .from(dashboardSnapshots)
      .where(eq(dashboardSnapshots.snapshotDate, dateKey))
      .limit(1);
    return rows.length > 0;
  } catch (error) {
    console.warn("Could not check snapshot date:", error);
    return false;
  }
}

export async function runDailyMarketUpdate({
  force = false,
  trigger = "cron",
}: {
  force?: boolean;
  trigger?: UpdateTrigger;
} = {}): Promise<DailyUpdateResult> {
  const dateKey = getVietnamDateKey();

  if (!isDatabaseAvailable()) {
    return {
      ok: false,
      dateKey,
      skipped: false,
      trigger,
      message: "DATABASE_URL is not configured. Set it in .env to enable auto-updates.",
      quoteCount: 0,
      newsCount: 0,
      data: getDashboardData(),
    };
  }

  if (!force && (await hasFreshSnapshot())) {
    const data = await getLatestDashboardData();
    return {
      ok: true,
      dateKey,
      skipped: true,
      trigger,
      message: `Snapshot gần nhất còn mới (< ${MIN_UPDATE_INTERVAL_MINUTES} phút), bỏ qua để tránh cập nhật trùng.`,
      quoteCount: 0,
      newsCount: 0,
      data,
    };
  }

  const { data, quoteCount, newsCount } = await buildAutoDashboardData(trigger);
  await ensureDashboardTables();
  const database = requireDb();

  const inserted = await database
    .insert(dashboardSnapshots)
    .values({ snapshotDate: dateKey, data })
    .returning({ id: dashboardSnapshots.id });

  await database.insert(marketAlerts).values({
    alertType: "hourly_auto_update",
    title: `ORCA tự động quét ${getVietnamTimestamp()}`,
    message: `Đã quét ${quoteCount} mã thị trường và ${newsCount} tin tức. Lịch tự động: mỗi ${HOURLY_UPDATE_INTERVAL_MINUTES} phút.`,
    severity: quoteCount >= 6 ? "info" : "warning",
  });

  await database.execute(sql`
    delete from dashboard_snapshots
    where created_at < now() - interval '45 days'
  `);

  await database.execute(sql`
    delete from market_alerts
    where created_at < now() - interval '45 days'
  `);

  return {
    ok: true,
    dateKey,
    skipped: false,
    trigger,
    message: "Đã tạo snapshot dashboard tự động theo lịch mỗi 1 giờ.",
    snapshotId: inserted[0]?.id,
    quoteCount,
    newsCount,
    data,
  };
}

export async function maybeRunDueUpdate(): Promise<DailyUpdateResult | null> {
  if (!isDatabaseAvailable()) return null;
  if (await hasFreshSnapshot()) return null;
  return runDailyMarketUpdate({ trigger: "on-demand" });
}
