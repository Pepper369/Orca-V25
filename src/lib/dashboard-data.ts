export interface MarketIndex {
  name: string;
  ticker: string;
  value: number;
  dailyChange: number;
  dailyChangePct: number;
  weeklyChange: number;
  monthlyChange: number;
  trend: "bullish" | "bearish" | "neutral";
}

export interface MacroIndicator {
  name: string;
  latestValue: string;
  previousValue: string;
  trend: "up" | "down" | "stable";
  impact: string;
  unit: string;
}

export interface Commodity {
  name: string;
  category: string;
  price: number;
  unit: string;
  dailyChange: number;
  weeklyTrend: "up" | "down" | "flat";
  monthlyTrend: "up" | "down" | "flat";
  vnImpact: string;
  weeklyChangePct?: number;
  monthlyChangePct?: number;
  ytdChangePct?: number;
  source: string;
  asOf: string;
  drivers: string;
  vnSectors: string[];
}

export interface NewsItem {
  headline: string;
  source: string;
  time: string;
  summary: string;
  impact: "high" | "medium" | "low";
  riskLevel: string;
  sectors: string[];
  verified: boolean;
}

export interface SectorData {
  name: string;
  relativeStrength: number;
  capitalFlow: "inflow" | "outflow" | "neutral";
  momentum: number;
  valuation: "attractive" | "fair" | "expensive";
  technicalScore: number;
}

export interface StockPick {
  ticker: string;
  company: string;
  sector: string;
  fundamentalScore: number;
  technicalScore: number;
  momentumScore: number;
  valuationScore: number;
  riskScore: "Thấp" | "Trung bình" | "Cao";
  entryZone: string;
  target1: string;
  target2: string;
  stopLoss: string;
  expectedReturn: string;
  thesis: string;
  risks: string;
  stars: number;
}

export interface DashboardData {
  date: string;
  dateShort: string;
  timestamp: string;
  sentimentScore: number;
  riskScore: number;
  fearGreedScore: number;
  orcaPulse: string;
  vietnamMarkets: MarketIndex[];
  globalMarkets: MarketIndex[];
  vietnamMacro: MacroIndicator[];
  globalMacro: MacroIndicator[];
  commodities: Commodity[];
  globalNews: NewsItem[];
  vietnamNews: NewsItem[];
  corporateNews: NewsItem[];
  sectors: SectorData[];
  technicalAnalysis: {
    vnindex: {
      ma20: number;
      ma50: number;
      ma200: number;
      rsi: number;
      macd: string;
      bollingerUpper: number;
      bollingerLower: number;
      adx: number;
      breadth: string;
      trend: string;
      supports: number[];
      resistances: number[];
      shortTermOutlook: string;
      mediumTermOutlook: string;
      probabilityScore: number;
    };
    vn30: {
      ma20: number;
      ma50: number;
      ma200: number;
      rsi: number;
      macd: string;
      bollingerUpper: number;
      bollingerLower: number;
      adx: number;
      breadth: string;
      trend: string;
      supports: number[];
      resistances: number[];
      shortTermOutlook: string;
      mediumTermOutlook: string;
      probabilityScore: number;
    };
  };
  strategy: {
    regime: string;
    cashPct: number;
    stocksPct: number;
    bondsPct: number;
    goldPct: number;
    recommendedSectors: string[];
    riskGuidance: string;
    tradingThemes: string[];
    catalysts: string[];
  };
  stockPicks: StockPick[];
  executiveSummary: {
    keyMessage: string;
    biggestOpportunity: string;
    biggestRisk: string;
    sectorToWatch: string;
    stockToWatch: string;
    nextDayOutlook: string;
  };
  confidenceScores: {
    dataReliability: number;
    macroConfidence: number;
    technicalConfidence: number;
    strategyConfidence: number;
    overallConfidence: number;
    explanation: string;
  };
}

export function getDashboardData(): DashboardData {
  return {
    date: "Thứ Ba, ngày 09 tháng 06 năm 2026",
    dateShort: "09/06/2026",
    timestamp: "Cập nhật: 08:10 SA (GMT+7) | 09/06/2026 | Dữ liệu thị trường đến close 08/06",

    // ───────────────────────────────────────────
    // ORCA MARKET PULSE — Ngày 09/06/2026
    // Bối cảnh: VN-Index mất mốc 1,800 sau phiên 08/06, khối ngoại bán ròng mạnh.
    // Mỹ hồi kỹ thuật nhờ chip rebound nhưng CPI/PPI, Oracle và SpaceX IPO vẫn là rủi ro lớn.
    // ───────────────────────────────────────────
    sentimentScore: 36,
    riskScore: 78,
    fearGreedScore: 30,
    orcaPulse: "Risk-Off nội địa — VN-Index mất 1,800, chờ CPI Mỹ",

    // ───────────────────────────────────────────
    // SECTION 1 · THỊ TRƯỜNG VIỆT NAM (Close 08/06/2026)
    // Sources: Vietnam.vn/Báo Tin Tức, Trading Economics, HOSE context
    // VN-Index 1,790.53 (-48.37 điểm) mất mốc tâm lý 1,800.
    // Toàn thị trường: 509 mã giảm / 208 mã tăng; VN30: 27 giảm / 2 tăng / 1 đứng giá.
    // HOSE khớp lệnh >613 triệu cp, giá trị >15,900 tỷ; khối ngoại bán ròng >671 tỷ.
    // ───────────────────────────────────────────
    vietnamMarkets: [
      { name: "VNINDEX", ticker: "VNI", value: 1790.53, dailyChange: -48.37, dailyChangePct: -2.63, weeklyChange: -2.63, monthlyChange: -5.04, trend: "bearish" },
      { name: "VN30", ticker: "VN30", value: 1935.80, dailyChange: -50.48, dailyChangePct: -2.54, weeklyChange: -3.22, monthlyChange: -5.25, trend: "bearish" },
      { name: "HNX-INDEX", ticker: "HNX", value: 298.36, dailyChange: 4.57, dailyChangePct: 1.56, weeklyChange: 1.56, monthlyChange: 14.48, trend: "neutral" },
      { name: "UPCOM", ticker: "UPC", value: 123.10, dailyChange: -1.06, dailyChangePct: -0.85, weeklyChange: -1.95, monthlyChange: 0.20, trend: "neutral" },
    ],

    // ───────────────────────────────────────────
    // THỊ TRƯỜNG TOÀN CẦU (Close June 8, 2026) — TECH REBOUND NHẸ
    // Sources: CNBC, Yahoo Finance, TheStreet, Economic Times
    // S&P 500 +0.30%, Nasdaq +0.86% nhờ chip hồi sau selloff; Dow -0.16%.
    // SOX/SMH hồi kỹ thuật nhưng chưa lấy lại xu hướng. US 10Y ~4.56%, CPI 10/06 là rủi ro chính.
    // ───────────────────────────────────────────
    globalMarkets: [
      { name: "S&P 500", ticker: "SPX", value: 7405.73, dailyChange: 21.99, dailyChangePct: 0.30, weeklyChange: -2.22, monthlyChange: 0.58, trend: "neutral" },
      { name: "NASDAQ", ticker: "IXIC", value: 25929.66, dailyChange: 220.23, dailyChangePct: 0.86, weeklyChange: -3.88, monthlyChange: 0.26, trend: "neutral" },
      { name: "DOW JONES", ticker: "DJI", value: 50786.01, dailyChange: -80.77, dailyChangePct: -0.16, weeklyChange: -0.76, monthlyChange: 1.86, trend: "neutral" },
      { name: "Russell 2000", ticker: "RUT", value: 2854.06, dailyChange: 24.06, dailyChangePct: 0.85, weeklyChange: -2.95, monthlyChange: -0.30, trend: "neutral" },
      { name: "DAX", ticker: "DAX", value: 24346.00, dailyChange: -413.05, dailyChangePct: -1.67, weeklyChange: -2.88, monthlyChange: -0.65, trend: "bearish" },
      { name: "FTSE 100", ticker: "FTSE", value: 10368.00, dailyChange: 8.00, dailyChangePct: 0.07, weeklyChange: 0.25, monthlyChange: 1.15, trend: "neutral" },
      { name: "Nikkei 225", ticker: "N225", value: 64085.00, dailyChange: -2503.12, dailyChangePct: -3.76, weeklyChange: -4.10, monthlyChange: -0.85, trend: "bearish" },
      { name: "Hang Seng", ticker: "HSI", value: 24961.95, dailyChange: -290.00, dailyChangePct: -1.15, weeklyChange: -1.50, monthlyChange: -1.85, trend: "bearish" },
      { name: "Shanghai", ticker: "SHCOMP", value: 3968.00, dailyChange: -59.74, dailyChangePct: -1.49, weeklyChange: -2.10, monthlyChange: -0.65, trend: "bearish" },
    ],

    // ───────────────────────────────────────────
    // SECTION 2 · KINH TẾ VĨ MÔ
    // Sources: NSO Vietnam (nso.gov.vn), SBV, Trading Economics, Bloomberg
    // CPI Q1/2026: +3.51% YoY (highest in 5 years)
    // Core inflation Q1/2026: +3.63%
    // VNINDEX all-time high: 1,936.55 (May 2026)
    // ───────────────────────────────────────────
    vietnamMacro: [
      { name: "GDP (Q1/2026)", latestValue: "6.93", previousValue: "7.09 (Q4/2025)", trend: "down", impact: "Tăng trưởng duy trì tốt nhưng giảm tốc nhẹ", unit: "% YoY" },
      { name: "CPI (Tháng 3/2026)", latestValue: "4.65", previousValue: "3.48 (T12/2025)", trend: "up", impact: "⚠ Lạm phát tăng mạnh nhất 5 năm", unit: "% YoY" },
      { name: "CPI bình quân Q1/2026", latestValue: "3.51", previousValue: "3.31 (2025)", trend: "up", impact: "Vượt mục tiêu 4% nếu tiếp tục", unit: "% YoY" },
      { name: "Lạm phát lõi Q1/2026", latestValue: "3.63", previousValue: "2.94 (Q4/2025)", trend: "up", impact: "⚠ Lạm phát lõi tăng mạnh, cần theo dõi", unit: "%" },
      { name: "Tỷ giá USD/VND", latestValue: "25,850", previousValue: "25,480", trend: "up", impact: "VND yếu đi do USD Index và dầu tăng", unit: "VND" },
      { name: "Chỉ số giá vàng (T3/2026)", latestValue: "+82.77", previousValue: "+18.81 vs T12/2025", trend: "up", impact: "Giá vàng trong nước tăng phi mã", unit: "% YoY" },
      { name: "Tăng trưởng tín dụng", latestValue: "13.8", previousValue: "15.08", trend: "down", impact: "Hấp thụ tín dụng chậm lại", unit: "%" },
      { name: "PMI Sản xuất", latestValue: "51.2", previousValue: "50.8", trend: "up", impact: "Sản xuất tiếp tục mở rộng", unit: "điểm" },
      { name: "FDI đăng ký 5T/2026", latestValue: "18.5", previousValue: "15.2 (5T/2025)", trend: "up", impact: "Dòng vốn FDI kỷ lục, Samsung mở rộng", unit: "tỷ USD" },
    ],

    globalMacro: [
      { name: "Fed Funds Rate", latestValue: "4.25–4.50", previousValue: "4.50–4.75", trend: "down", impact: "Fed đã cắt, nhưng lo lạm phát quay lại", unit: "%" },
      { name: "Chủ tịch Fed mới K. Warsh", latestValue: "Họp đầu tiên T6", previousValue: "—", trend: "stable", impact: "Warsh họp FOMC lần đầu — sự kiện lớn", unit: "" },
      { name: "NFP Mỹ tháng 5", latestValue: "172,000", previousValue: "~80,000 kỳ vọng", trend: "up", impact: "Việc làm vượt mạnh dự báo, làm tăng kỳ vọng Fed có thể tăng lãi suất", unit: "việc làm" },
      { name: "Xác suất Fed tăng LS", latestValue: "~43–51", previousValue: "~26–34", trend: "up", impact: "Rate-hike bets tăng mạnh sau NFP, gây áp lực lên cổ phiếu tăng trưởng/AI", unit: "%" },
      { name: "US CPI tháng 5", latestValue: "Chờ 10/06", previousValue: "3.8 (T4)", trend: "stable", impact: "CPI là sự kiện trọng tâm tuần 08–12/06; kỳ vọng headline có thể lên ~4.2% YoY", unit: "% YoY" },
      { name: "US 10Y Treasury", latestValue: "4.56", previousValue: "4.54", trend: "up", impact: "Lợi suất tiếp tục nhích lên sau NFP, giữ áp lực lên tech và EM", unit: "%" },
      { name: "US Dollar Index (DXY)", latestValue: "~100.0", previousValue: "100.02", trend: "stable", impact: "USD neo cao trước CPI, gây áp lực tỷ giá và dòng vốn EM", unit: "điểm" },
      { name: "VIX", latestValue: "18.52", previousValue: "~21.5", trend: "down", impact: "VIX hạ sau phiên chip rebound nhưng vẫn cao hơn nền đầu tháng", unit: "điểm" },
      { name: "China PMI (T5/2026)", latestValue: "50.5", previousValue: "50.1", trend: "up", impact: "Kinh tế TQ hồi phục nhẹ", unit: "điểm" },
    ],

    // ───────────────────────────────────────────
    // SECTION 3 · HÀNG HÓA (mở rộng, nhiều nhóm hơn)
    // Sources: Trading Economics, Reuters, FT, Markets Insider, Investing.com, Westmetall
    // Coverage: 29 mặt hàng | Energy, Precious, Base Metals, Bulk Materials, Agriculture & Softs
    // ───────────────────────────────────────────
    commodities: [
      {
        name: "Dầu Brent",
        category: "Năng lượng",
        price: 96.18,
        unit: "USD/thùng",
        dailyChange: 3.32,
        weeklyTrend: "up",
        monthlyTrend: "down",
        weeklyChangePct: 1.05,
        monthlyChangePct: -14.70,
        ytdChangePct: 43.45,
        source: "Investing.com / CNBC / Trading Economics",
        asOf: "08/06/2026",
        drivers: "Dầu bật lại khi Iran-Israel trao đổi đòn mới, dù thị trường vẫn đặt cược đàm phán Mỹ-Iran chưa đổ vỡ.",
        vnImpact: "Dầu hồi hỗ trợ nhóm PVD/PVS/GAS ngắn hạn nhưng gây áp lực CPI và chi phí vận tải nếu kéo dài.",
        vnSectors: ["Dầu khí", "Vận tải", "Nhựa", "Hàng không"],
      },
      {
        name: "Dầu WTI",
        category: "Năng lượng",
        price: 94.06,
        unit: "USD/thùng",
        dailyChange: 3.89,
        weeklyTrend: "up",
        monthlyTrend: "down",
        monthlyChangePct: -13.10,
        ytdChangePct: 56.30,
        source: "Trading Economics / TheStreet",
        asOf: "08/06/2026",
        drivers: "WTI hồi mạnh theo rủi ro Trung Đông và lực bắt đáy năng lượng sau cú giảm cuối tuần.",
        vnImpact: "Tác động tương tự Brent, đặc biệt lên kỳ vọng lạm phát và nhóm vận tải, hóa chất.",
        vnSectors: ["Dầu khí", "Vận tải", "Hóa chất"],
      },
      {
        name: "Khí tự nhiên Henry Hub",
        category: "Năng lượng",
        price: 3.18,
        unit: "USD/MMBtu",
        dailyChange: 0.08,
        weeklyTrend: "up",
        monthlyTrend: "up",
        weeklyChangePct: 5.7,
        monthlyChangePct: 10.98,
        ytdChangePct: -13.68,
        source: "Trading Economics",
        asOf: "02/06/2026",
        drivers: "Cung LNG thắt chặt, nhu cầu điện mùa hè, liên thông với giá dầu và khí châu Âu.",
        vnImpact: "Ảnh hưởng chi phí điện khí, các nhà máy điện khí và nhập khẩu LNG của Việt Nam.",
        vnSectors: ["Điện khí", "Năng lượng", "Công nghiệp"],
      },
      {
        name: "Xăng RBOB",
        category: "Năng lượng",
        price: 3.14,
        unit: "USD/gallon",
        dailyChange: -0.14,
        weeklyTrend: "down",
        monthlyTrend: "down",
        monthlyChangePct: -16.01,
        ytdChangePct: 79.57,
        source: "Trading Economics",
        asOf: "03/06/2026",
        drivers: "Biên crack spread cao nhưng nhu cầu tiêu dùng và tồn kho điều chỉnh mạnh trong tháng.",
        vnImpact: "Gợi ý xu hướng giá bán lẻ xăng dầu nội địa, tác động trực tiếp CPI và chi phí doanh nghiệp.",
        vnSectors: ["Bán lẻ xăng dầu", "Vận tải", "Tiêu dùng"],
      },
      {
        name: "Heating Oil",
        category: "Năng lượng",
        price: 3.63,
        unit: "USD/gallon",
        dailyChange: -0.2,
        weeklyTrend: "up",
        monthlyTrend: "down",
        weeklyChangePct: 0.3,
        monthlyChangePct: -10.83,
        ytdChangePct: 71.2,
        source: "Trading Economics",
        asOf: "02/06/2026",
        drivers: "Chi phí distillates cao do chiến sự và tồn kho nhiên liệu tinh chế không dồi dào.",
        vnImpact: "Gây áp lực chi phí nhiên liệu vận tải, ngư nghiệp và logistics lạnh.",
        vnSectors: ["Logistics", "Vận tải biển", "Thủy sản"],
      },
      {
        name: "Than nhiệt Newcastle",
        category: "Năng lượng",
        price: 140.3,
        unit: "USD/tấn",
        dailyChange: 2.6,
        weeklyTrend: "up",
        monthlyTrend: "up",
        weeklyChangePct: 6.25,
        monthlyChangePct: 3.5,
        ytdChangePct: 30.51,
        source: "Trading Economics",
        asOf: "01/06/2026",
        drivers: "LNG đắt làm tăng khả năng fuel-switching sang than tại châu Á, đặc biệt điện than.",
        vnImpact: "Tăng chi phí phát điện than, ảnh hưởng biên lợi nhuận nhóm điện và công nghiệp nặng.",
        vnSectors: ["Điện", "Xi măng", "Thép"],
      },
      {
        name: "TTF Gas châu Âu",
        category: "Năng lượng",
        price: 48.07,
        unit: "EUR/MWh",
        dailyChange: -0.56,
        weeklyTrend: "up",
        monthlyTrend: "flat",
        weeklyChangePct: 0.91,
        monthlyChangePct: -0.15,
        ytdChangePct: 70.69,
        source: "Trading Economics",
        asOf: "02/06/2026",
        drivers: "Nguồn cung khí châu Âu vẫn mong manh, nhạy cảm với địa chính trị và mùa tích trữ.",
        vnImpact: "Tham chiếu cho giá LNG nhập khẩu khu vực châu Á, ảnh hưởng dài hạn kế hoạch điện khí Việt Nam.",
        vnSectors: ["Điện khí", "Năng lượng", "Cảng LNG"],
      },
      {
        name: "Uranium",
        category: "Năng lượng",
        price: 85.95,
        unit: "USD/lb",
        dailyChange: 1.06,
        weeklyTrend: "up",
        monthlyTrend: "down",
        monthlyChangePct: -0.58,
        ytdChangePct: 4.16,
        source: "Trading Economics",
        asOf: "01/06/2026",
        drivers: "Nhu cầu điện hạt nhân và đầu tư vào chuỗi nhiên liệu hạt nhân vẫn giữ nền giá.",
        vnImpact: "Ảnh hưởng gián tiếp tới câu chuyện năng lượng dài hạn và thiết bị điện/năng lượng sạch.",
        vnSectors: ["Năng lượng", "Thiết bị điện"],
      },
      {
        name: "Vàng spot",
        category: "Kim loại quý",
        price: 4308.21,
        unit: "USD/oz",
        dailyChange: -0.53,
        weeklyTrend: "down",
        monthlyTrend: "down",
        weeklyChangePct: -4.10,
        monthlyChangePct: -8.86,
        ytdChangePct: -0.40,
        source: "Trading Economics",
        asOf: "08/06/2026",
        drivers: "Vàng tiếp tục yếu do USD neo cao và lợi suất 10Y quanh 4.56%, dù rủi ro địa chính trị tăng.",
        vnImpact: "Ảnh hưởng tâm lý trú ẩn, tỷ giá và thị trường vàng trong nước; hỗ trợ cổ phiếu bán lẻ vàng.",
        vnSectors: ["Vàng bạc đá quý", "Ngân hàng", "Tỷ giá"],
      },
      {
        name: "Bạc",
        category: "Kim loại quý",
        price: 73.65,
        unit: "USD/oz",
        dailyChange: -0.06,
        weeklyTrend: "down",
        monthlyTrend: "up",
        weeklyChangePct: -2.75,
        monthlyChangePct: 2.40,
        ytdChangePct: 4.80,
        source: "TheStreet / Trading Economics",
        asOf: "04/06/2026",
        drivers: "Kép giữa vai trò kim loại quý và cầu công nghiệp từ điện tử, năng lượng mặt trời.",
        vnImpact: "Ảnh hưởng gián tiếp tới nhóm điện tử, năng lượng tái tạo và tâm lý phòng thủ.",
        vnSectors: ["Điện tử", "Năng lượng tái tạo"],
      },
      {
        name: "Bạch kim",
        category: "Kim loại quý",
        price: 1937,
        unit: "USD/oz",
        dailyChange: 0.45,
        weeklyTrend: "down",
        monthlyTrend: "down",
        weeklyChangePct: -0.75,
        monthlyChangePct: -1.25,
        ytdChangePct: -6.43,
        source: "Trading Economics",
        asOf: "02/06/2026",
        drivers: "Nguồn cung công nghiệp và nhu cầu ô tô/thiết bị xúc tác giữ giá ở mức cao.",
        vnImpact: "Ảnh hưởng thấp hơn vàng nhưng là chỉ báo chuỗi công nghiệp ô tô toàn cầu.",
        vnSectors: ["Ô tô phụ trợ", "Công nghiệp"],
      },
      {
        name: "Palladium",
        category: "Kim loại quý",
        price: 1385.5,
        unit: "USD/oz",
        dailyChange: -0.5,
        weeklyTrend: "flat",
        monthlyTrend: "down",
        monthlyChangePct: -6.48,
        source: "Trading Economics",
        asOf: "03/06/2026",
        drivers: "Cầu xúc tác ô tô biến động, đồng USD và lãi suất tiếp tục chi phối ngắn hạn.",
        vnImpact: "Tác động gián tiếp đến chuỗi linh kiện ô tô và sản xuất phụ trợ xuất khẩu.",
        vnSectors: ["Ô tô phụ trợ", "Xuất khẩu công nghiệp"],
      },
      {
        name: "Đồng",
        category: "Kim loại cơ bản",
        price: 6.64,
        unit: "USD/lb",
        dailyChange: -0.12,
        weeklyTrend: "up",
        monthlyTrend: "up",
        monthlyChangePct: 14.6,
        ytdChangePct: 14.99,
        source: "Trading Economics",
        asOf: "03/06/2026",
        drivers: "Kỳ vọng đầu tư lưới điện, data center và điện khí hóa tiếp tục đẩy cầu đồng cao.",
        vnImpact: "Tăng chi phí đầu vào dây cáp, điện, xây dựng; tích cực cho doanh nghiệp khai khoáng và hạ tầng điện.",
        vnSectors: ["Điện", "Xây dựng", "Khai khoáng"],
      },
      {
        name: "Nhôm",
        category: "Kim loại cơ bản",
        price: 3700.05,
        unit: "USD/tấn",
        dailyChange: -1.65,
        weeklyTrend: "flat",
        monthlyTrend: "up",
        monthlyChangePct: 3.48,
        source: "Trading Economics",
        asOf: "03/06/2026",
        drivers: "Nguồn cung luyện kim và chi phí điện cao giữ mặt bằng giá nhôm cao dù đang điều chỉnh ngắn hạn.",
        vnImpact: "Ảnh hưởng trực tiếp tới bao bì, vật liệu xây dựng, cáp nhôm và công nghiệp chế biến.",
        vnSectors: ["Bao bì", "Xây dựng", "Công nghiệp"],
      },
      {
        name: "Niken",
        category: "Kim loại cơ bản",
        price: 18997.38,
        unit: "USD/tấn",
        dailyChange: -1.13,
        weeklyTrend: "down",
        monthlyTrend: "down",
        monthlyChangePct: -1.24,
        source: "Trading Economics",
        asOf: "03/06/2026",
        drivers: "Indonesia vẫn là biến số nguồn cung lớn; cầu pin EV và thép không gỉ hỗ trợ trung hạn.",
        vnImpact: "Tác động tới thép inox, pin và chuỗi EV; chưa ảnh hưởng lớn bằng thép hay đồng.",
        vnSectors: ["Thép", "Pin", "Công nghiệp"],
      },
      {
        name: "Kẽm",
        category: "Kim loại cơ bản",
        price: 3612,
        unit: "USD/tấn",
        dailyChange: 1.6,
        weeklyTrend: "up",
        monthlyTrend: "flat",
        source: "Westmetall",
        asOf: "02/06/2026",
        drivers: "Tồn kho LME thấp và đóng cửa nhà máy luyện kẽm hỗ trợ giá tăng trở lại.",
        vnImpact: "Ảnh hưởng trực tiếp ngành tôn mạ, mạ kẽm, dây cáp và vật liệu xây dựng.",
        vnSectors: ["Tôn mạ", "Thép", "Vật liệu xây dựng"],
      },
      {
        name: "Quặng sắt",
        category: "Nguyên liệu công nghiệp",
        price: 105.03,
        unit: "USD/tấn",
        dailyChange: -3.48,
        weeklyTrend: "down",
        monthlyTrend: "down",
        weeklyChangePct: -3.87,
        monthlyChangePct: -2.9,
        ytdChangePct: -1.96,
        source: "Trading Economics",
        asOf: "01/06/2026",
        drivers: "Trung Quốc bổ sung tồn kho nhưng nhu cầu thép xây dựng chưa đồng đều, biên lợi nhuận lò cao dao động.",
        vnImpact: "Giảm áp lực chi phí nguyên liệu cho HPG/HSG/NKG, nhưng cũng phản ánh cầu thép chưa thực sự mạnh.",
        vnSectors: ["Thép", "Xây dựng", "Hạ tầng"],
      },
      {
        name: "HRC Steel",
        category: "Nguyên liệu công nghiệp",
        price: 1188,
        unit: "USD/tấn",
        dailyChange: -0.17,
        weeklyTrend: "up",
        monthlyTrend: "up",
        weeklyChangePct: 1.45,
        monthlyChangePct: 4.3,
        ytdChangePct: 27.06,
        source: "Trading Economics",
        asOf: "01/06/2026",
        drivers: "Nhu cầu hạ tầng, cơ khí và chi phí nguyên liệu vẫn hỗ trợ mặt bằng HRC ở mức cao.",
        vnImpact: "Tác động trực tiếp đến HPG, HSG, NKG; biên lợi nhuận có thể cải thiện nếu quặng sắt giảm nhanh hơn HRC.",
        vnSectors: ["Thép", "Tôn mạ", "Cơ khí"],
      },
      {
        name: "Lithium",
        category: "Nguyên liệu công nghiệp",
        price: 170500,
        unit: "CNY/tấn",
        dailyChange: -2.99,
        weeklyTrend: "down",
        monthlyTrend: "down",
        monthlyChangePct: -9.07,
        ytdChangePct: 182.99,
        source: "Trading Economics",
        asOf: "03/06/2026",
        drivers: "Nguồn cung pin tăng nhanh nhưng nhu cầu xe điện toàn cầu vẫn giữ nền giá rất cao so với cùng kỳ.",
        vnImpact: "Liên quan dài hạn đến câu chuyện vật liệu pin, logistics hóa chất và chuỗi EV trong khu vực.",
        vnSectors: ["Pin", "EV", "Hóa chất"],
      },
      {
        name: "Ngô",
        category: "Nông sản & softs",
        price: 4.31,
        unit: "USD/giạ",
        dailyChange: -2.21,
        weeklyTrend: "down",
        monthlyTrend: "flat",
        source: "Markets Insider",
        asOf: "03/06/2026",
        drivers: "Thời tiết Mỹ cải thiện và kỳ vọng mùa vụ tốt tạo áp lực giảm giá ngô ngắn hạn.",
        vnImpact: "Giảm bớt áp lực chi phí thức ăn chăn nuôi cho DBC, BAF và nhóm chăn nuôi." ,
        vnSectors: ["Chăn nuôi", "Thức ăn chăn nuôi", "Thực phẩm"],
      },
      {
        name: "Lúa mì",
        category: "Nông sản & softs",
        price: 604.6,
        unit: "USc/giạ",
        dailyChange: -0.68,
        weeklyTrend: "down",
        monthlyTrend: "down",
        weeklyChangePct: -4.86,
        monthlyChangePct: -3.96,
        ytdChangePct: 19.25,
        source: "Trading Economics",
        asOf: "02/06/2026",
        drivers: "Nguồn cung toàn cầu cải thiện nhưng rủi ro thời tiết và logistics Biển Đen vẫn còn.",
        vnImpact: "Tác động gián tiếp đến bột mì, thực phẩm chế biến và chi phí đầu vào nhóm FMCG.",
        vnSectors: ["FMCG", "Thực phẩm", "Bánh kẹo"],
      },
      {
        name: "Đậu nành",
        category: "Nông sản & softs",
        price: 11.54,
        unit: "USD/giạ",
        dailyChange: -1.01,
        weeklyTrend: "down",
        monthlyTrend: "down",
        weeklyChangePct: -0.83,
        monthlyChangePct: -3.26,
        ytdChangePct: 14.13,
        source: "Markets Insider / Trading Economics",
        asOf: "03/06/2026",
        drivers: "Thời tiết Mỹ thuận lợi, tồn kho Nam Mỹ cao và nhu cầu Trung Quốc yếu gây áp lực lên giá.",
        vnImpact: "Giảm chi phí dầu ăn, khô đậu và thức ăn chăn nuôi; tích cực cho biên lợi nhuận doanh nghiệp thực phẩm.",
        vnSectors: ["Dầu ăn", "Chăn nuôi", "Thực phẩm"],
      },
      {
        name: "Gạo rough rice",
        category: "Nông sản & softs",
        price: 12.53,
        unit: "USD/cwt",
        dailyChange: -1.03,
        weeklyTrend: "down",
        monthlyTrend: "up",
        weeklyChangePct: -3.85,
        monthlyChangePct: 9.94,
        ytdChangePct: 30.28,
        source: "Markets Insider / Trading Economics",
        asOf: "03/06/2026",
        drivers: "Biến động nguồn cung châu Á và chính sách xuất khẩu tiếp tục chi phối giá gạo toàn cầu.",
        vnImpact: "Việt Nam là nước xuất khẩu gạo lớn nên giá cao hỗ trợ doanh nghiệp gạo nhưng cũng ảnh hưởng chi phí tiêu dùng trong nước.",
        vnSectors: ["Xuất khẩu gạo", "Tiêu dùng", "Nông nghiệp"],
      },
      {
        name: "Dầu cọ",
        category: "Nông sản & softs",
        price: 4610,
        unit: "MYR/tấn",
        dailyChange: 2.9,
        weeklyTrend: "up",
        monthlyTrend: "flat",
        weeklyChangePct: 1.09,
        monthlyChangePct: -0.77,
        ytdChangePct: 11.98,
        source: "Markets Insider / Trading Economics",
        asOf: "03/06/2026",
        drivers: "Nguồn cung Malaysia/Indonesia và nhu cầu biodiesel tạo biến động lớn cho dầu thực vật.",
        vnImpact: "Ảnh hưởng giá dầu ăn, biên lợi nhuận doanh nghiệp thực phẩm và hàng tiêu dùng.",
        vnSectors: ["Thực phẩm", "Dầu ăn", "FMCG"],
      },
      {
        name: "Bông",
        category: "Nông sản & softs",
        price: 0.77,
        unit: "USD/lb",
        dailyChange: -0.4,
        weeklyTrend: "down",
        monthlyTrend: "down",
        weeklyChangePct: -0.9,
        monthlyChangePct: -7.54,
        ytdChangePct: 19.29,
        source: "Markets Insider / Trading Economics",
        asOf: "03/06/2026",
        drivers: "Cầu dệt may chưa đồng đều, trong khi mùa vụ Mỹ và tỷ giá tiếp tục là biến số lớn.",
        vnImpact: "Quan trọng với các doanh nghiệp dệt may xuất khẩu như TCM, MSH, STK ở góc chi phí đầu vào.",
        vnSectors: ["Dệt may", "Xuất khẩu", "Sợi"],
      },
      {
        name: "Cà phê Arabica",
        category: "Nông sản & softs",
        price: 2.53,
        unit: "USD/lb",
        dailyChange: -2.35,
        weeklyTrend: "down",
        monthlyTrend: "down",
        weeklyChangePct: -5.11,
        monthlyChangePct: -8.93,
        ytdChangePct: -25.45,
        source: "Markets Insider / Trading Economics",
        asOf: "03/06/2026",
        drivers: "Nguồn cung Brazil cải thiện và đầu cơ rút bớt sau giai đoạn tăng nóng.",
        vnImpact: "Tác động gián tiếp tới tương quan giá cà phê thế giới; Arabica yếu có thể làm spread với Robusta thu hẹp.",
        vnSectors: ["Cà phê", "Xuất khẩu nông sản"],
      },
      {
        name: "Cà phê Robusta",
        category: "Nông sản & softs",
        price: 3455,
        unit: "USD/tấn",
        dailyChange: 0.49,
        weeklyTrend: "flat",
        monthlyTrend: "down",
        source: "FT Markets",
        asOf: "02/06/2026",
        drivers: "Tồn kho ICE vẫn nhạy cảm, nguồn cung Việt Nam/Brazil và nhu cầu rang xay giữ giá ở mức cao.",
        vnImpact: "Rất quan trọng với xuất khẩu cà phê Việt Nam; giá còn cao hỗ trợ dòng tiền doanh nghiệp và nông hộ.",
        vnSectors: ["Xuất khẩu cà phê", "Nông nghiệp", "Logistics"],
      },
      {
        name: "Cocoa",
        category: "Nông sản & softs",
        price: 4108,
        unit: "USD/tấn",
        dailyChange: 5.47,
        weeklyTrend: "up",
        monthlyTrend: "up",
        monthlyChangePct: 5.79,
        source: "Trading Economics",
        asOf: "02/06/2026",
        drivers: "Nguồn cung Tây Phi thắt chặt hơn dự kiến, tồn kho thấp khiến giá bật mạnh trở lại.",
        vnImpact: "Ảnh hưởng chi phí đầu vào ngành bánh kẹo, thực phẩm chế biến và biên lợi nhuận FMCG.",
        vnSectors: ["Bánh kẹo", "FMCG", "Thực phẩm"],
      },
      {
        name: "Đường #11",
        category: "Nông sản & softs",
        price: 14.42,
        unit: "USc/lb",
        dailyChange: -0.21,
        weeklyTrend: "flat",
        monthlyTrend: "flat",
        source: "FT Markets",
        asOf: "02/06/2026",
        drivers: "Nguồn cung Brazil, Ấn Độ và ethanol là các biến số quyết định mặt bằng giá đường.",
        vnImpact: "Giá đường ổn định hỗ trợ các doanh nghiệp mía đường như SBT, QNS trong kế hoạch giá bán.",
        vnSectors: ["Mía đường", "Đồ uống", "Thực phẩm"],
      },
      {
        name: "Cao su",
        category: "Nông sản & softs",
        price: 228.3,
        unit: "US cents/kg",
        dailyChange: 2.79,
        weeklyTrend: "up",
        monthlyTrend: "up",
        weeklyChangePct: 3.4,
        monthlyChangePct: 5.99,
        ytdChangePct: 26.9,
        source: "Trading Economics",
        asOf: "29/05/2026",
        drivers: "Nhu cầu lốp xe châu Á và rủi ro thời tiết tại các vùng trồng lớn đang nâng giá cao su.",
        vnImpact: "Tích cực cho nhóm cao su tự nhiên và KCN sở hữu quỹ đất cao su chuyển đổi như GVR, PHR, DPR.",
        vnSectors: ["Cao su", "KCN", "Săm lốp"],
      },
    ],

    // ───────────────────────────────────────────
    // SECTION 4 · TIN VĨ MÔ QUỐC TẾ & LỊCH TUẦN 08-12/06/2026
    // Sources: CNN, Yahoo Finance, Schwab, Kiplinger, CMC Markets, Reuters, Trading Economics
    // ───────────────────────────────────────────
    globalNews: [
      {
        headline: "Phố Wall hồi kỹ thuật: Nasdaq +0.86%, S&P 500 +0.30% nhờ chip rebound",
        source: "CNBC / Yahoo Finance / TheStreet",
        time: "08/06/2026 16:00 ET",
        summary: "Sau cú bán tháo mạnh ngày 05/06, thị trường Mỹ hồi nhẹ: S&P 500 đóng cửa 7,405.73 (+0.30%), Nasdaq 25,929.66 (+0.86%) nhờ nhóm chip phục hồi; Dow giảm nhẹ 80.77 điểm (-0.16%) về 50,786.01. Micron bật gần 10%, Nvidia và Broadcom hồi. Tuy nhiên đây mới là hồi kỹ thuật, chưa xóa rủi ro từ lợi suất cao và CPI 10/06.",
        impact: "high",
        riskLevel: "Trung bình",
        sectors: ["Công nghệ", "Bán dẫn", "Chứng khoán"],
        verified: true,
      },
      {
        headline: "US 10Y lên 4.564%, CPI Mỹ 10/06 là biến số lớn nhất trong 48 giờ tới",
        source: "TheStreet / Kiplinger / New York Fed Calendar",
        time: "09/06/2026",
        summary: "Lợi suất 10 năm Mỹ nhích lên 4.564% sau NFP mạnh. CPI tháng 5 sẽ công bố 10/06 lúc 8:30 ET. Nếu CPI nóng hơn kỳ vọng, xác suất Fed tăng lãi suất cuối năm có thể tăng thêm, kéo USD lên và gây áp lực cho cổ phiếu tăng trưởng, vàng và thị trường mới nổi.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Toàn thị trường", "Tỷ giá", "Ngân hàng", "Công nghệ"],
        verified: true,
      },
      {
        headline: "Oracle earnings 10/06: phép thử AI software sau cú sốc Broadcom",
        source: "Schwab / CMC Markets / Zacks",
        time: "10/06/2026 sau giờ Mỹ",
        summary: "Oracle dự kiến báo cáo Q4 với EPS khoảng $1.96 và doanh thu khoảng $19.1 tỷ. Sau khi Broadcom làm rung chuyển nhóm chip/AI, Oracle sẽ là bài kiểm tra quan trọng cho câu chuyện AI infrastructure và cloud software. Kết quả tốt có thể giúp Nasdaq ổn định; kết quả yếu sẽ làm tăng rủi ro bán tiếp.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["AI", "Cloud", "Công nghệ", "Phần mềm"],
        verified: true,
      },
      {
        headline: "SpaceX IPO ngày 12/06 có thể hút thanh khoản khỏi nhóm thắng lớn",
        source: "Yahoo Finance / TheStreet / Polymarket context",
        time: "Roadshow 08/06, dự kiến niêm yết 12/06/2026",
        summary: "SpaceX được kỳ vọng chào bán ở $135/cp, quy mô khoảng $75 tỷ, định giá có thể $1.75-1.78 nghìn tỷ. Đây là IPO lớn nhất lịch sử nếu hoàn tất. Cramer và nhiều nhà quan sát cảnh báo mega-IPO có thể là phép thử lớn với định giá AI và có thể khiến nhà đầu tư bán bớt cổ phiếu thắng lớn để lấy tiền tham gia.",
        impact: "medium",
        riskLevel: "Trung bình",
        sectors: ["IPO", "Công nghệ", "AI", "Hàng không vũ trụ"],
        verified: true,
      },
      {
        headline: "Dầu bật lại: Brent ~$96.18, WTI ~$94 do Trung Đông tái căng thẳng",
        source: "Investing.com / CNBC / Trading Economics",
        time: "08/06/2026",
        summary: "Dầu tăng trở lại sau khi Iran-Israel trao đổi đòn mới dù thị trường vẫn kỳ vọng đàm phán Mỹ-Iran chưa đổ vỡ. Brent quanh $96.18, WTI quanh $94.06. Dầu tăng trở lại làm phức tạp câu chuyện CPI, nhưng cũng hỗ trợ trading ngắn hạn nhóm dầu khí.",
        impact: "high",
        riskLevel: "Trung bình",
        sectors: ["Dầu khí", "Vận tải", "Hàng không", "Tiêu dùng"],
        verified: true,
      },
      {
        headline: "Apple WWDC đang diễn ra: thị trường chờ tín hiệu AI và Siri mới",
        source: "Futu News / Market commentary",
        time: "08-12/06/2026",
        summary: "Apple WWDC là sự kiện công nghệ chính trong tuần. Nếu Apple đưa ra lộ trình AI/Siri đủ thuyết phục, tâm lý megacap có thể được hỗ trợ; nếu thiếu điểm nhấn, áp lực từ đợt bán tháo AI/chip có thể kéo dài.",
        impact: "medium",
        riskLevel: "Trung bình",
        sectors: ["Công nghệ", "AI", "Điện tử tiêu dùng"],
        verified: true,
      }
    ],

    // ───────────────────────────────────────────
    // SECTION 5 · TIN VĨ MÔ VIỆT NAM (Verified)
    // Sources: NSO Vietnam, SSI Research, VietnamNews, SBV, Bộ XD
    // ───────────────────────────────────────────
    vietnamNews: [
      {
        headline: "VN-Index bốc hơi 48.37 điểm, đóng cửa 1,790.53 — mất mốc tâm lý 1,800",
        source: "Vietnam.vn / Báo Tin Tức / HOSE",
        time: "08/06/2026 15:00 (đóng cửa)",
        summary: "VN-Index giảm mạnh 48.37 điểm xuống 1,790.53 điểm. Toàn thị trường nghiêng hẳn về bên bán với 509 mã giảm và chỉ 208 mã tăng. VN30 chịu áp lực nặng: 27 mã giảm, 2 mã tăng và 1 đứng giá. Đây là tín hiệu risk-off nội địa rõ ràng, phủ nhận nhịp hồi nhẹ cuối tuần trước.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Toàn thị trường", "VN30", "Blue-chips"],
        verified: true,
      },
      {
        headline: "VIC, VHM, BID, VPB kéo VN-Index giảm hơn 26.68 điểm",
        source: "Vietnam.vn / Báo Tin Tức",
        time: "08/06/2026",
        summary: "Nhóm vốn hóa lớn tiếp tục gây áp lực chính. VIC, VHM, BID và VPB lấy đi hơn 26.68 điểm của VN-Index. Bất động sản là nhóm giảm mạnh nhất (-4.36%) với VIC -5.8%, VHM -3.49%, VRE -5.13%, BCM -2.03%, KBC -3.39%. Áp lực lan sang công nghệ và truyền thông.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Bất động sản", "Ngân hàng", "VN30"],
        verified: true,
      },
      {
        headline: "Khối ngoại bán ròng trên HOSE hơn 671 tỷ, tập trung FPT, VHM, MSN, VIC",
        source: "Vietnam.vn / HOSE",
        time: "08/06/2026",
        summary: "Nhà đầu tư nước ngoài quay lại bán ròng mạnh trên HOSE với giá trị hơn 671.11 tỷ đồng, tập trung FPT (212.62 tỷ), VHM (113.43 tỷ), MSN (93.65 tỷ) và VIC (84.51 tỷ). Trên HNX, khối ngoại mua ròng nhẹ hơn 3.94 tỷ đồng, tập trung CEO, PVS, NTP và VC3.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Khối ngoại", "Công nghệ", "Bất động sản", "Tiêu dùng"],
        verified: true,
      },
      {
        headline: "CPI tháng 3/2026 tăng 4.65% YoY — cao nhất 5 năm, lạm phát lõi 3.63%",
        source: "Tổng cục Thống kê (NSO)",
        time: "04/04/2026 (công bố chính thức)",
        summary: "CPI tháng 3/2026 tăng 1.23% MoM, 4.65% YoY — mức cao nhất trong 5 năm qua. Nguyên nhân chính: giá xăng dầu tăng theo thế giới, chi phí vật liệu xây dựng tăng, giá thực phẩm & ăn uống ngoài leo thang. Bình quân Q1/2026, CPI tăng 3.51% YoY, lạm phát lõi 3.63%. Đây là thách thức lớn cho mục tiêu kiểm soát lạm phát của Quốc hội.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Ngân hàng", "Tiêu dùng", "Bất động sản"],
        verified: true,
      },
      {
        headline: "SSI Research: Mục tiêu VNINDEX 1,920 năm 2026, EPS tăng 14.5%",
        source: "SSI Research",
        time: "30/05/2026",
        summary: "SSI Research duy trì quan điểm tích cực dài hạn với mục tiêu VN-Index 1,750-1,800 (thận trọng) đến 1,920 (lạc quan). Forward P/E 2026 ở mức 12.7x, thấp hơn trung bình lịch sử. GDP Q2 dự kiến tăng 7.5% YoY. Chủ đề đầu tư: BĐS & Đầu tư công, Chi phí đầu vào giảm, Nâng hạng thị trường, Cải cách pháp lý.",
        impact: "high",
        riskLevel: "Thấp",
        sectors: ["Toàn thị trường"],
        verified: true,
      },
      {
        headline: "VN-Index điều chỉnh trước kỳ nghỉ lễ — VIC, VHM, TCB, VPB kéo giảm >24 điểm",
        source: "VietnamNews / Vietstock",
        time: "29/04/2026",
        summary: "VN-Index giảm mạnh với VN30 mất 18.65 điểm (-0.91%) về 2,022.75. Nhóm Vingroup (VIC), Vinhomes (VHM), Techcombank (TCB) và VPBank (VPB) cùng kéo giảm hơn 24 điểm. Áp lực bán chiếm ưu thế buổi chiều dù nỗ lực mua vào không đủ mạnh để đảo chiều.",
        impact: "medium",
        riskLevel: "Trung bình",
        sectors: ["Bất động sản", "Ngân hàng"],
        verified: true,
      },
      {
        headline: "Cải cách thị trường vốn: KRX, STP/SWIFT, bỏ pre-funding — hướng tới nâng hạng",
        source: "SSI Research / SSC",
        time: "30/05/2026",
        summary: "Ủy ban CK Nhà nước đẩy nhanh loạt cải cách: hệ thống KRX, quy trình mở tài khoản đơn giản hơn, bỏ yêu cầu pre-funding, rút ngắn IPO-to-listing, và triển khai hệ thống STP tích hợp SWIFT cho thanh toán tự động. Đây là bước quan trọng hướng tới MSCI EM nâng hạng.",
        impact: "high",
        riskLevel: "Thấp",
        sectors: ["Chứng khoán", "Toàn thị trường"],
        verified: true,
      },
    ],

    // ───────────────────────────────────────────
    // SECTION 6 · TIN DOANH NGHIỆP
    // ───────────────────────────────────────────
    corporateNews: [
      {
        headline: "VIC, VHM, BID, VPB là nhóm kéo giảm mạnh nhất phiên 08/06",
        source: "Vietnam.vn / HOSE",
        time: "08/06/2026",
        summary: "Bốn mã VIC, VHM, BID và VPB lấy đi hơn 26.68 điểm của VN-Index trong phiên giảm 48.37 điểm. VIC giảm 5.8%, VHM giảm 3.49%, VRE giảm 5.13%. Áp lực bán ở nhóm vốn hóa lớn khiến VN-Index mất mốc 1,800 dù HNX vẫn tăng.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Bất động sản", "Ngân hàng", "VN30"],
        verified: true,
      },
      {
        headline: "HOSE: Vốn hóa thị trường đạt ₫9,175 nghìn tỷ, P/E 11.2x — rẻ hơn khu vực",
        source: "SimplyWall.St / HOSE",
        time: "29/05/2026",
        summary: "Vốn hóa HOSE tại thời điểm 29/05/2026 đạt ₫9,175.2 nghìn tỷ. Revenue ₫4,674.2 nghìn tỷ, Earnings ₫640.3 nghìn tỷ. P/E trailing 11.2x, P/S 2x — thấp hơn trung bình khu vực châu Á (13-15x). Forward P/E 12.7x theo SSI.",
        impact: "medium",
        riskLevel: "Thấp",
        sectors: ["Toàn thị trường"],
        verified: true,
      },
      {
        headline: "FPT bị khối ngoại bán ròng 212.62 tỷ và giảm 2.8%",
        source: "Vietnam.vn / HOSE",
        time: "08/06/2026",
        summary: "Nhóm công nghệ giảm 2.66%, trong đó FPT giảm 2.8%, FOX -3.2%, CTR -4.26%, CMG -1.27%. Khối ngoại bán ròng FPT mạnh nhất HOSE với 212.62 tỷ đồng, cho thấy sentiment công nghệ Việt Nam cũng chịu tác động từ selloff AI/chip toàn cầu.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Công nghệ", "Khối ngoại"],
        verified: true,
      },
      {
        headline: "Nhóm chứng khoán dẫn đầu đà giảm: HCM -4.2%, SSI -3.6%, VND -3.4%, VCI -2.6%",
        source: "vietnam.vn / HOSE",
        time: "03/06/2026",
        summary: "Cổ phiếu chứng khoán trở thành tâm điểm bán tháo sau vài phiên dao động. Bảng điện đỏ rực với HCM -4.2%, SSI -3.6%, VND -3.4%, SHS -3.1%, VCI -2.6%. Nhóm này nhạy cảm với thanh khoản và tâm lý thị trường, phản ánh lo ngại về nhịp điều chỉnh sâu hơn.",
        impact: "high",
        riskLevel: "Cao",
        sectors: ["Chứng khoán"],
        verified: true,
      },
      {
        headline: "Ngân hàng không đỡ được thị trường: BID -1.6%, VCB -1.2%, CTG -1%",
        source: "vietnam.vn / HOSE",
        time: "03/06/2026",
        summary: "Nhóm ngân hàng vốn hóa lớn không thể nâng đỡ chỉ số khi BID giảm 1.6%, VCB -1.2%, CTG -1%. VN30 mất hơn 11 điểm. Tuy nhiên định giá toàn thị trường vẫn hấp dẫn (P/E ~11x), tạo cơ hội tích lũy dài hạn cho nhóm ngân hàng khi thị trường ổn định.",
        impact: "medium",
        riskLevel: "Trung bình",
        sectors: ["Ngân hàng"],
        verified: true,
      },
      {
        headline: "HOSE: Vốn hóa ₫9,175 nghìn tỷ, P/E 11.2x — định giá rẻ hơn khu vực",
        source: "SimplyWall.St / HOSE",
        time: "29/05/2026",
        summary: "Vốn hóa HOSE đạt ₫9,175.2 nghìn tỷ, Earnings ₫640.3 nghìn tỷ. P/E trailing 11.2x, P/S 2x — thấp hơn trung bình khu vực châu Á (13-15x). Dù nhịp điều chỉnh hiện tại, định giá hấp dẫn là điểm tựa cho dòng tiền dài hạn và kịch bản nâng hạng MSCI.",
        impact: "medium",
        riskLevel: "Thấp",
        sectors: ["Toàn thị trường"],
        verified: true,
      },
    ],

    // ───────────────────────────────────────────
    // SECTION 7 · PHÂN TÍCH NGÀNH
    // VN30 signal: Strong Buy (Investing.com India)
    // Mkt cap ₫9,175 tỷ, P/E 11.2x
    // ───────────────────────────────────────────
    // Phiên 03/06 risk-off: Dầu khí mạnh nhất (giá dầu cao), Năng lượng/Điện phòng thủ
    // CK & BĐS yếu nhất (bán tháo), Ngân hàng chịu áp lực
    sectors: [
      { name: "Ngân hàng", relativeStrength: 48, capitalFlow: "outflow", momentum: 38, valuation: "attractive", technicalScore: 42 },
      { name: "Chứng khoán", relativeStrength: 42, capitalFlow: "outflow", momentum: 35, valuation: "fair", technicalScore: 38 },
      { name: "Bất động sản", relativeStrength: 30, capitalFlow: "outflow", momentum: 25, valuation: "fair", technicalScore: 28 },
      { name: "Thép", relativeStrength: 52, capitalFlow: "neutral", momentum: 45, valuation: "fair", technicalScore: 48 },
      { name: "Dầu khí", relativeStrength: 58, capitalFlow: "neutral", momentum: 52, valuation: "fair", technicalScore: 55 },
      { name: "Công nghệ", relativeStrength: 35, capitalFlow: "outflow", momentum: 30, valuation: "expensive", technicalScore: 32 },
      { name: "Bán lẻ", relativeStrength: 46, capitalFlow: "outflow", momentum: 40, valuation: "fair", technicalScore: 42 },
      { name: "KCN", relativeStrength: 44, capitalFlow: "outflow", momentum: 36, valuation: "attractive", technicalScore: 40 },
      { name: "Xây dựng", relativeStrength: 50, capitalFlow: "neutral", momentum: 44, valuation: "attractive", technicalScore: 46 },
      { name: "Điện", relativeStrength: 62, capitalFlow: "neutral", momentum: 56, valuation: "fair", technicalScore: 58 },
      { name: "Logistics", relativeStrength: 48, capitalFlow: "neutral", momentum: 42, valuation: "fair", technicalScore: 44 },
    ],

    // ───────────────────────────────────────────
    // SECTION 8 · PHÂN TÍCH KỸ THUẬT
    // VNINDEX: 1,826.47, ATH 1,936.55, 52W range 1,299.94–1,936.55
    // VN30: ~1,997, 52W 1,381.43–2,121.13, daily signal "Sell"
    // ───────────────────────────────────────────
    technicalAnalysis: {
      vnindex: {
        ma20: 1858.40,
        ma50: 1876.20,
        ma200: 1691.60,
        rsi: 35.2,
        macd: "Tín hiệu bán mở rộng (-12.80), histogram âm tăng mạnh",
        bollingerUpper: 1924.30,
        bollingerLower: 1782.40,
        adx: 31.5,
        breadth: "Rất tiêu cực (509 giảm / 208 tăng), VN30 có 27/30 mã giảm",
        trend: "Giảm ngắn hạn — thủng mốc tâm lý 1,800",
        supports: [1780, 1750, 1720],
        resistances: [1800, 1822, 1841],
        shortTermOutlook: "VN-Index 1,790.53 đã thủng mốc 1,800 với nến giảm mạnh và độ rộng rất xấu. RSI 35.2 tiến gần quá bán nhưng chưa có tín hiệu đảo chiều. Nếu không giành lại 1,800-1,822 trong 1-2 phiên, rủi ro test 1,750 tăng đáng kể.",
        mediumTermOutlook: "Trung lập tiêu cực — MA200 quanh 1,692 vẫn cách xa và chưa gãy xu hướng dài hạn, nhưng việc khối ngoại bán ròng và nhóm trụ VIC/VHM/BID/VPB suy yếu cho thấy cần thời gian tái cân bằng. Chỉ tích lũy dài hạn từng phần khi thị trường tạo đáy hai phiên liên tiếp.",
        probabilityScore: 30,
      },
      vn30: {
        ma20: 1998.50,
        ma50: 2015.20,
        ma200: 1871.00,
        rsi: 36.8,
        macd: "Tín hiệu bán (-11.40), VN30 bị bán đồng loạt",
        bollingerUpper: 2058.00,
        bollingerLower: 1925.00,
        adx: 29.4,
        breadth: "Rất xấu (27 giảm / 2 tăng / 1 đứng giá)",
        trend: "Giảm mạnh — áp lực blue-chip lan rộng",
        supports: [1925, 1900, 1871],
        resistances: [1960, 1980, 2000],
        shortTermOutlook: "VN30 ước quanh 1,936 sau phiên bán mạnh, thủng vùng hỗ trợ ngắn hạn. Áp lực đến từ ngân hàng và bất động sản vốn hóa lớn. Cần lấy lại 1,960-1,980 để giảm rủi ro bán tiếp.",
        mediumTermOutlook: "Trung lập tiêu cực — VN30 vẫn trên MA200 nhưng momentum đã xấu đi rõ. Ưu tiên quan sát VCB/BID/TCB/MBB hơn là bắt đáy toàn rổ.",
        probabilityScore: 32,
      },
    },

    // ───────────────────────────────────────────
    // SECTION 9 · CHIẾN LƯỢC ORCA
    // Bối cảnh: VNINDEX điều chỉnh -5.7% từ đỉnh, S&P lập kỷ lục,
    // dầu tăng mạnh, lạm phát VN tăng, Fed bất định
    // ───────────────────────────────────────────
    strategy: {
      regime: "Risk-Off nội địa — bảo toàn vốn, chờ tái chiếm 1,800",
      cashPct: 45,
      stocksPct: 25,
      bondsPct: 15,
      goldPct: 15,
      recommendedSectors: ["Điện / Tiện ích", "Tiêu dùng thiết yếu", "Dầu khí trading ngắn hạn", "Ngân hàng quốc doanh chờ nền", "Hạ tầng công phòng thủ"],
      riskGuidance: "VN-Index đã thủng 1,800 với độ rộng rất xấu và khối ngoại bán ròng mạnh. Giảm cổ phiếu về 25%, nâng tiền mặt lên 45%, không dùng margin. Không bắt đáy ngay phiên 09/06 trừ khi chỉ số giành lại 1,800 với thanh khoản giảm bán. Các vị thế đang lỗ cần stop-loss theo kỷ luật. Chỉ mở vị thế nhỏ ở nhóm phòng thủ hoặc cổ phiếu có câu chuyện riêng; chờ CPI Mỹ 10/06 trước khi tăng rủi ro.",
      tradingThemes: [
        "🛡 Phòng thủ: POW, REE, NT2 — ưu tiên nếu thị trường còn bán lan rộng",
        "🛢 Dầu khí trading ngắn hạn: PVS, PVD, GAS — Brent hồi $96 nhưng chỉ mua khi có điểm kỹ thuật rõ",
        "🏦 Ngân hàng quốc doanh: VCB, BID, CTG — không bắt đáy vội, chờ VN-Index lấy lại 1,800-1,822",
        "🏗 Đầu tư công: HHV, VCG, C4G — theo dõi nếu dòng tiền né nhóm BĐS/công nghệ",
        "🚫 Tránh nhóm yếu: Bất động sản vốn hóa lớn, công nghệ cao beta, chứng khoán margin cao",
      ],
      catalysts: [
        "⚡ VN-Index có giành lại 1,800-1,822 hay không — tín hiệu quan trọng nhất ngày 09/06",
        "⚡ 10/06: US CPI tháng 5 — quyết định USD, lợi suất và khẩu vị rủi ro toàn cầu",
        "⚡ 10/06 Oracle earnings — kiểm định rebound của nhóm AI/software sau chip selloff",
        "⚡ Khối ngoại có tiếp tục bán ròng FPT/VHM/VIC/MSN hay giảm áp lực",
        "⚡ Dầu Brent quanh $96 — hỗ trợ dầu khí nhưng gây áp lực CPI nếu tăng tiếp",
        "⚡ SpaceX IPO 12/06 — rủi ro hút thanh khoản khỏi nhóm công nghệ tăng nóng",
      ],
    },

    // ───────────────────────────────────────────
    // SECTION 10 · KHUYẾN NGHỊ CỔ PHIẾU
    // Chiến lược: PHÒNG THỦ + CHỌN LỌC trong nhịp điều chỉnh
    // ───────────────────────────────────────────
    stockPicks: [
      {
        ticker: "VCB",
        company: "Vietcombank",
        sector: "Ngân hàng",
        fundamentalScore: 88,
        technicalScore: 68,
        momentumScore: 64,
        valuationScore: 76,
        riskScore: "Thấp",
        entryZone: "92,000 – 96,000",
        target1: "104,000",
        target2: "112,000",
        stopLoss: "88,000",
        expectedReturn: "10–18%",
        thesis: "Ưu tiên ngân hàng vốn hóa lớn trong tuần biến động cao. VCB có chất lượng tài sản tốt, thanh khoản cao, hưởng lợi nếu dòng tiền xoay từ tech/AI sang financials/value. Định giá thị trường PE 11.1x hỗ trợ chiến lược tích lũy blue-chip.",
        risks: "Khối ngoại bán ròng kéo dài và lợi suất Mỹ tăng có thể gây áp lực lên nhóm ngân hàng. Không mua đuổi nếu VN-Index chưa vượt 1,865.",
        stars: 5,
      },
      {
        ticker: "FPT",
        company: "FPT Corporation",
        sector: "Công nghệ",
        fundamentalScore: 92,
        technicalScore: 48,
        momentumScore: 42,
        valuationScore: 58,
        riskScore: "Cao",
        entryZone: "Chờ ổn định, không mua đuổi",
        target1: "Theo dõi lại sau CPI",
        target2: "—",
        stopLoss: "Quản trị vị thế hiện có",
        expectedReturn: "Chưa ưu tiên mua mới",
        thesis: "FPT vẫn là cổ phiếu công nghệ chất lượng dài hạn, nhưng phiên 08/06 bị bán ròng mạnh 212.62 tỷ và giảm 2.8%. Trong bối cảnh Nasdaq/chip còn nhiễu trước CPI và Oracle earnings, chỉ nên theo dõi hoặc nắm giữ tỷ trọng thấp.",
        risks: "Khối ngoại bán ròng, định giá cao và áp lực từ AI/chip selloff toàn cầu. Nếu thủng hỗ trợ kỹ thuật cần giảm tỷ trọng.",
        stars: 3,
      },
      {
        ticker: "PVS",
        company: "PV Technical Services",
        sector: "Dầu khí / Dịch vụ kỹ thuật",
        fundamentalScore: 76,
        technicalScore: 64,
        momentumScore: 62,
        valuationScore: 70,
        riskScore: "Trung bình",
        entryZone: "Mua trading khi giữ hỗ trợ, không mua đuổi",
        target1: "+8–12% từ vùng mua",
        target2: "+15% nếu Brent duy trì >95",
        stopLoss: "-5% từ điểm mua",
        expectedReturn: "8–15% trading",
        thesis: "PVS là mã dầu khí dịch vụ kỹ thuật được hưởng lợi khi Brent hồi quanh $96. Khối ngoại mua ròng nhẹ trên HNX có nhắc tới PVS. Phù hợp trading ngắn hạn hơn là mua tích lũy mạnh trong bối cảnh thị trường chung risk-off.",
        risks: "Dầu đảo chiều giảm hoặc VN-Index mất tiếp 1,780 sẽ kéo nhóm dầu khí giảm theo. Chỉ dùng tỷ trọng nhỏ.",
        stars: 4,
      },
      {
        ticker: "POW",
        company: "PV Power",
        sector: "Điện / Tiện ích",
        fundamentalScore: 74,
        technicalScore: 66,
        momentumScore: 60,
        valuationScore: 78,
        riskScore: "Thấp",
        entryZone: "12,500 – 13,500",
        target1: "15,500",
        target2: "17,000",
        stopLoss: "11,800",
        expectedReturn: "15–25%",
        thesis: "Cổ phiếu PHÒNG THỦ điển hình trong môi trường risk-off. Nhu cầu điện cao mùa nắng nóng, các nhà máy điện khí Nhơn Trạch vận hành ổn định. Dòng tiền tìm nơi trú ẩn khi thị trường biến động. Định giá hấp dẫn.",
        risks: "Giá khí đầu vào tăng theo dầu có thể bóp biên LN. Rủi ro huy động sản lượng từ EVN.",
        stars: 4,
      },
      {
        ticker: "BID",
        company: "BIDV",
        sector: "Ngân hàng",
        fundamentalScore: 82,
        technicalScore: 66,
        momentumScore: 62,
        valuationScore: 74,
        riskScore: "Trung bình",
        entryZone: "48,000 – 51,000",
        target1: "56,000",
        target2: "60,000",
        stopLoss: "45,500",
        expectedReturn: "10–20%",
        thesis: "BID là blue-chip ngân hàng có beta vừa phải, phù hợp chiến lược tích lũy từng phần khi VN-Index kiểm định 1,800–1,822. Hưởng lợi nếu dòng tiền quay lại nhóm financials sau selloff công nghệ toàn cầu.",
        risks: "Rủi ro nợ xấu và áp lực tỷ giá/lãi suất. Cần quản trị vị thế trước CPI/PPI Mỹ.",
        stars: 4,
      },
    ],

    // ───────────────────────────────────────────
    // SECTION 11 · TÓM TẮT ĐIỀU HÀNH
    // ───────────────────────────────────────────
    executiveSummary: {
      keyMessage: "VN-Index mất mốc 1,800 trong phiên 08/06, giảm 48.37 điểm còn 1,790.53 với 509 mã giảm và VN30 có 27/30 mã đỏ. Khối ngoại bán ròng hơn 671 tỷ, tập trung FPT, VHM, MSN, VIC. Mỹ hồi kỹ thuật nhẹ nhờ chip rebound nhưng CPI 10/06 và lợi suất 10Y 4.56% vẫn là rủi ro lớn. Chiến lược 09/06: giảm rủi ro, tăng tiền mặt, không bắt đáy vội.",
      biggestOpportunity: "🟢 Cơ hội chỉ nằm ở trading rất chọn lọc: điện/tiện ích phòng thủ (POW, REE), dầu khí khi Brent giữ trên $95 (PVS, PVD, GAS), ngân hàng quốc doanh nếu VN-Index giành lại 1,800–1,822. Định giá rẻ không đủ để mua mạnh nếu dòng tiền và khối ngoại chưa xác nhận.",
      biggestRisk: "🔴 Rủi ro chính: thủng 1,800 kích hoạt bán kỹ thuật, bất động sản -4.36%, công nghệ bị bán ròng FPT, khối ngoại bán tiếp, CPI Mỹ 10/06 có thể đẩy USD/lợi suất tăng. Nếu VN-Index không hồi lại 1,800, vùng 1,750 có thể bị kiểm định.",
      sectorToWatch: "Điện/Tiện ích phòng thủ, Dầu khí trading, Ngân hàng quốc doanh chờ nền",
      stockToWatch: "POW / PVS — chỉ ưu tiên tỷ trọng nhỏ; FPT chuyển sang theo dõi do khối ngoại bán mạnh",
      nextDayOutlook: "Kịch bản cơ sở ngày 09/06: VN-Index kiểm định lại 1,800. Nếu vượt và giữ trên 1,800 với áp lực bán giảm, thị trường có thể hồi kỹ thuật về 1,822. Nếu bị bán xuống dưới 1,780, ưu tiên hạ tiếp tỷ trọng và chờ 1,750. Tuyệt đối không dùng margin trước CPI Mỹ.",
    },

    // ───────────────────────────────────────────
    // SECTION 12 · AI CONFIDENCE
    // ───────────────────────────────────────────
    confidenceScores: {
      dataReliability: 93,
      macroConfidence: 84,
      technicalConfidence: 82,
      strategyConfidence: 85,
      overallConfidence: 86,
      explanation: "Bản ngày 09/06/2026 được cập nhật từ Vietnam.vn/Báo Tin Tức, HOSE context, CNBC, Yahoo Finance, TheStreet, Economic Times, Trading Economics, Investing.com, Kiplinger và New York Fed Calendar. Dữ liệu Việt Nam mới nhất: VN-Index 1,790.53 (-48.37 điểm) ngày 08/06; HNX 298.36 (+4.57); breadth 509 giảm/208 tăng; khối ngoại bán ròng HOSE >671.11 tỷ. Dữ liệu Mỹ close 08/06: S&P 500 7,405.73 (+0.30%), Nasdaq 25,929.66 (+0.86%), Dow 50,786.01 (-0.16%). Hàng hóa: Brent ~$96.18, WTI ~$94.06, vàng ~$4,308. Rủi ro chính: VN-Index thủng 1,800, CPI Mỹ 10/06, lợi suất US10Y 4.56%, khối ngoại bán ròng.",
    },
  };
}
