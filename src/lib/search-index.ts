import type { DashboardData } from "@/lib/dashboard-data";

export interface SearchItem {
  category: string;
  categoryIcon: string;
  title: string;
  subtitle: string;
  detail: string;
  tab: number;
  /** Concatenated, normalized text used for matching. */
  haystack: string;
}

/** Remove Vietnamese diacritics and lowercase for accent-insensitive search. */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function makeItem(
  category: string,
  categoryIcon: string,
  title: string,
  subtitle: string,
  detail: string,
  tab: number
): SearchItem {
  return {
    category,
    categoryIcon,
    title,
    subtitle,
    detail,
    tab,
    haystack: normalizeText(`${category} ${title} ${subtitle} ${detail}`),
  };
}

/** Build a flat, searchable index from the full dashboard dataset. */
export function buildSearchIndex(data: DashboardData): SearchItem[] {
  const items: SearchItem[] = [];

  // Tab 0 — Vietnam markets
  data.vietnamMarkets.forEach((m) => {
    items.push(
      makeItem(
        "Thị trường VN",
        "🇻🇳",
        `${m.name} (${m.ticker})`,
        `${m.value.toLocaleString("en-US")} | Ngày: ${m.dailyChangePct >= 0 ? "+" : ""}${m.dailyChangePct}%`,
        `Tuần: ${m.weeklyChange >= 0 ? "+" : ""}${m.weeklyChange}% · Tháng: ${m.monthlyChange >= 0 ? "+" : ""}${m.monthlyChange}% · Xu hướng: ${m.trend}`,
        0
      )
    );
  });

  // Tab 0 — Global markets
  data.globalMarkets.forEach((m) => {
    items.push(
      makeItem(
        "Thị trường toàn cầu",
        "🌍",
        `${m.name} (${m.ticker})`,
        `${m.value.toLocaleString("en-US")} | Ngày: ${m.dailyChangePct >= 0 ? "+" : ""}${m.dailyChangePct}%`,
        `Tuần: ${m.weeklyChange >= 0 ? "+" : ""}${m.weeklyChange}% · Tháng: ${m.monthlyChange >= 0 ? "+" : ""}${m.monthlyChange}% · Xu hướng: ${m.trend}`,
        0
      )
    );
  });

  // Tab 1 — Vietnam macro
  data.vietnamMacro.forEach((m) => {
    items.push(
      makeItem(
        "Vĩ mô Việt Nam",
        "📊",
        m.name,
        `${m.latestValue} ${m.unit} (trước: ${m.previousValue})`,
        m.impact,
        1
      )
    );
  });

  // Tab 1 — Global macro
  data.globalMacro.forEach((m) => {
    items.push(
      makeItem(
        "Vĩ mô toàn cầu",
        "🌐",
        m.name,
        `${m.latestValue} ${m.unit} (trước: ${m.previousValue})`,
        m.impact,
        1
      )
    );
  });

  // Tab 2 — Commodities
  data.commodities.forEach((c) => {
    items.push(
      makeItem(
        `Hàng hóa · ${c.category}`,
        "📦",
        c.name,
        `${c.price.toLocaleString("en-US")} ${c.unit} | ${c.dailyChange >= 0 ? "+" : ""}${c.dailyChange}% | ${c.source} | ${c.asOf}`,
        `${c.vnImpact} · Drivers: ${c.drivers} · Ngành VN: ${c.vnSectors.join(", ")}`,
        2
      )
    );
  });

  // Tab 3 — News (global, vietnam, corporate)
  data.globalNews.forEach((n) => {
    items.push(
      makeItem("Tin quốc tế", "📰", n.headline, `${n.source} · ${n.time}`, n.summary, 3)
    );
  });
  data.vietnamNews.forEach((n) => {
    items.push(
      makeItem("Tin Việt Nam", "🇻🇳", n.headline, `${n.source} · ${n.time}`, n.summary, 3)
    );
  });
  data.corporateNews.forEach((n) => {
    items.push(
      makeItem("Tin doanh nghiệp", "🏢", n.headline, `${n.source} · ${n.time}`, n.summary, 3)
    );
  });

  // Tab 4 — Sectors
  data.sectors.forEach((s) => {
    items.push(
      makeItem(
        "Ngành",
        "🔄",
        s.name,
        `RS: ${s.relativeStrength} · Momentum: ${s.momentum} · TA: ${s.technicalScore}`,
        `Dòng tiền: ${s.capitalFlow} · Định giá: ${s.valuation}`,
        4
      )
    );
  });

  // Tab 5 — Technical analysis
  (["vnindex", "vn30"] as const).forEach((key) => {
    const ta = data.technicalAnalysis[key];
    const label = key === "vnindex" ? "VNINDEX" : "VN30";
    items.push(
      makeItem(
        "Phân tích kỹ thuật",
        "📈",
        `${label} — ${ta.trend}`,
        `RSI: ${ta.rsi} · ADX: ${ta.adx} · ${ta.macd}`,
        `Hỗ trợ: ${ta.supports.join(", ")} · Kháng cự: ${ta.resistances.join(", ")} · ${ta.shortTermOutlook}`,
        5
      )
    );
  });

  // Tab 6 — Strategy
  items.push(
    makeItem(
      "Chiến lược",
      "🎯",
      `Chế độ: ${data.strategy.regime}`,
      `Cổ phiếu ${data.strategy.stocksPct}% · Tiền mặt ${data.strategy.cashPct}% · Trái phiếu ${data.strategy.bondsPct}% · Vàng ${data.strategy.goldPct}%`,
      data.strategy.riskGuidance,
      6
    )
  );
  data.strategy.tradingThemes.forEach((t) => {
    items.push(makeItem("Chủ đề giao dịch", "🎯", t, "Chiến lược ORCA", "", 6));
  });
  data.strategy.catalysts.forEach((c) => {
    items.push(makeItem("Xúc tác theo dõi", "⚡", c, "Chiến lược ORCA", "", 6));
  });

  // Tab 7 — Stock picks
  data.stockPicks.forEach((s) => {
    items.push(
      makeItem(
        "Cổ phiếu khuyến nghị",
        "⭐",
        `${s.ticker} — ${s.company}`,
        `${s.sector} · Mua: ${s.entryZone} · MT1: ${s.target1} · SL: ${s.stopLoss}`,
        `${s.thesis} | Rủi ro: ${s.risks}`,
        7
      )
    );
  });

  // Tab 0 — Executive summary
  const es = data.executiveSummary;
  items.push(makeItem("Tóm tắt điều hành", "📋", "Thông điệp chính", "Executive Summary", es.keyMessage, 0));
  items.push(makeItem("Tóm tắt điều hành", "💎", "Cơ hội lớn nhất", "Executive Summary", es.biggestOpportunity, 0));
  items.push(makeItem("Tóm tắt điều hành", "⚠️", "Rủi ro lớn nhất", "Executive Summary", es.biggestRisk, 0));
  items.push(makeItem("Tóm tắt điều hành", "🔭", "Triển vọng phiên sau", "Executive Summary", es.nextDayOutlook, 0));

  return items;
}

/**
 * Search the index. Supports the command syntax `[Thông tin] ngày dd/mm/yyyy`
 * where both the keyword and the date are matched (date is optional).
 */
export function searchIndex(index: SearchItem[], rawQuery: string): SearchItem[] {
  const query = rawQuery.trim();
  if (!query) return [];

  // Extract a date pattern (dd/mm/yyyy, dd-mm-yyyy, or partial like dd/mm)
  const dateMatch = query.match(/(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2,4}))?/);
  let keywordPart = query;
  let dateTokens: string[] = [];

  if (dateMatch) {
    keywordPart = query.replace(dateMatch[0], " ");
    const dd = dateMatch[1].padStart(2, "0");
    const mm = dateMatch[2].padStart(2, "0");
    const yyyy = dateMatch[3] ?? "";
    // Match common date renderings used in the data set
    dateTokens = [
      `${dd}/${mm}${yyyy ? "/" + yyyy : ""}`,
      `${dateMatch[1]}/${dateMatch[2]}${yyyy ? "/" + yyyy : ""}`,
    ].map(normalizeText);
  }

  // Strip the leading [...] brackets from the command form
  keywordPart = keywordPart.replace(/[[\]]/g, " ");

  const keywords = normalizeText(keywordPart)
    .split(" ")
    .filter((w) => w.length > 0);

  return index.filter((item) => {
    const keywordOk =
      keywords.length === 0 || keywords.every((w) => item.haystack.includes(w));
    const dateOk =
      dateTokens.length === 0 || dateTokens.some((d) => item.haystack.includes(d));
    return keywordOk && dateOk;
  });
}
