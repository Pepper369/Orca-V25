"use client";

import React, { useState, useRef, useEffect } from "react";
import type { DashboardData, MarketIndex, Commodity, SectorData, NewsItem, StockPick } from "@/lib/dashboard-data";
import { exportToPNG, exportToPDF } from "@/lib/export-utils";
import { SearchOverlay } from "@/components/SearchOverlay";

/* ─── SVG Logo ─── */
function OrcaLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1F4E79" />
          <stop offset="1" stopColor="#0D2A4A" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="30" y1="60" x2="100" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4AF37" />
          <stop offset="1" stopColor="#F0D78A" />
        </linearGradient>
      </defs>
      {/* Shield */}
      <path d="M60 8L108 30V70C108 95 60 115 60 115C60 115 12 95 12 70V30L60 8Z" fill="url(#shieldGrad)" stroke="#D4AF37" strokeWidth="2" />
      {/* Orca silhouette */}
      <ellipse cx="55" cy="52" rx="22" ry="14" fill="#0A1929" />
      <ellipse cx="48" cy="48" rx="4" ry="5" fill="#F2F4F7" />
      <circle cx="47" cy="47" r="1.5" fill="#0A1929" />
      <path d="M70 45C75 38 80 42 78 48C76 52 72 50 70 45Z" fill="#0A1929" />
      <ellipse cx="38" cy="55" rx="6" ry="3" fill="#F2F4F7" />
      {/* Chart bars */}
      <rect x="50" y="78" width="5" height="12" fill="url(#goldGrad)" rx="1" />
      <rect x="58" y="72" width="5" height="18" fill="url(#goldGrad)" rx="1" />
      <rect x="66" y="66" width="5" height="24" fill="url(#goldGrad)" rx="1" />
      <rect x="74" y="60" width="5" height="30" fill="url(#goldGrad)" rx="1" />
      {/* Arrow */}
      <path d="M52 82L78 56L82 60L78 56L74 56" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Helpers ─── */
const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 2 });
const pct = (n: number) => (n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`);
const clr = (n: number) => (n > 0 ? "text-profit" : n < 0 ? "text-loss" : "text-silver-400");
const bg = (n: number) => (n > 0 ? "bg-profit/10" : n < 0 ? "bg-loss/10" : "bg-silver-400/10");
const arrow = (n: number) => (n > 0 ? "▲" : n < 0 ? "▼" : "●");
const trendIcon = (t: string) => (t === "up" ? "↑" : t === "down" ? "↓" : "→");
const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
const impactColor = (i: string) => (i === "high" ? "text-loss" : i === "medium" ? "text-warn" : "text-silver-400");
const impactBg = (i: string) => (i === "high" ? "bg-loss/20 border-loss/30" : i === "medium" ? "bg-warn/20 border-warn/30" : "bg-silver-400/20 border-silver-400/30");
const impactLabel = (i: string) => (i === "high" ? "CAO" : i === "medium" ? "TRUNG BÌNH" : "THẤP");

function GaugeChart({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const percentage = (value / max) * 100;
  const color = percentage > 66 ? "#00C853" : percentage > 33 ? "#FFD600" : "#FF1744";
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (percentage / 100) * circumference * 0.75;
  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="70" viewBox="0 0 100 80">
        <path d="M 10 70 A 40 40 0 0 1 90 70" fill="none" stroke="rgba(31,78,121,0.3)" strokeWidth="8" strokeLinecap="round" />
        <path
          d="M 10 70 A 40 40 0 0 1 90 70"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75}`}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="50" y="55" textAnchor="middle" fill={color} fontSize="20" fontWeight="700">{value}</text>
      </svg>
      <span className="text-xs text-silver-300 mt-1 font-medium">{label}</span>
    </div>
  );
}

function SectionHeader({ number, title, icon }: { number: string; title: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-sm">{number}</div>
      <span className="text-lg mr-1">{icon}</span>
      <h2 className="text-lg font-bold text-gradient-gold tracking-wide">{title}</h2>
    </div>
  );
}

function MarketRow({ m }: { m: MarketIndex }) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-lg mb-1.5 ${bg(m.dailyChangePct)} transition-all`}>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-silver-100 truncate">{m.name}</div>
        <div className="text-xs text-silver-400">{m.ticker}</div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <div className="font-bold text-sm">{fmt(m.value)}</div>
        <div className={`text-xs font-semibold ${clr(m.dailyChangePct)}`}>
          {arrow(m.dailyChangePct)} {pct(m.dailyChangePct)}
        </div>
      </div>
      <div className="flex gap-2 ml-3 flex-shrink-0">
        <div className="text-center">
          <div className="text-[10px] text-silver-400">1W</div>
          <div className={`text-xs font-medium ${clr(m.weeklyChange)}`}>{pct(m.weeklyChange)}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-silver-400">1M</div>
          <div className={`text-xs font-medium ${clr(m.monthlyChange)}`}>{pct(m.monthlyChange)}</div>
        </div>
      </div>
    </div>
  );
}

function CommodityCard({ c }: { c: Commodity }) {
  const statColor = (value?: number) => {
    if (value === undefined) return "text-silver-400";
    return value > 0 ? "text-profit" : value < 0 ? "text-loss" : "text-silver-400";
  };

  const statLabel = (value?: number, suffix = "%") => {
    if (value === undefined) return "—";
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}${suffix}`;
  };

  return (
    <div className="glass-card p-3 mb-2">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm text-silver-100 leading-tight">{c.name}</div>
          <div className="text-[10px] text-gold-500 mt-0.5">{c.source} • {c.asOf}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-sm text-silver-100">{fmt(c.price)}</div>
          <div className="text-[10px] text-silver-400">{c.unit}</div>
          <div className={`text-xs font-semibold mt-0.5 ${clr(c.dailyChange)}`}>{pct(c.dailyChange)}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="rounded-lg bg-navy-800/60 px-2 py-1.5 text-center">
          <div className="text-[10px] text-silver-400">Ngày</div>
          <div className={`text-xs font-bold ${clr(c.dailyChange)}`}>{pct(c.dailyChange)}</div>
        </div>
        <div className="rounded-lg bg-navy-800/60 px-2 py-1.5 text-center">
          <div className="text-[10px] text-silver-400">1W</div>
          <div className={`text-xs font-bold ${statColor(c.weeklyChangePct)}`}>{statLabel(c.weeklyChangePct)}</div>
        </div>
        <div className="rounded-lg bg-navy-800/60 px-2 py-1.5 text-center">
          <div className="text-[10px] text-silver-400">1M</div>
          <div className={`text-xs font-bold ${statColor(c.monthlyChangePct)}`}>{statLabel(c.monthlyChangePct)}</div>
        </div>
        <div className="rounded-lg bg-navy-800/60 px-2 py-1.5 text-center">
          <div className="text-[10px] text-silver-400">YTD</div>
          <div className={`text-xs font-bold ${statColor(c.ytdChangePct)}`}>{statLabel(c.ytdChangePct)}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2 text-[10px] text-silver-400">
        <span>Xu hướng:</span>
        <span className={c.weeklyTrend === "up" ? "text-profit" : c.weeklyTrend === "down" ? "text-loss" : "text-silver-400"}>
          1W {trendIcon(c.weeklyTrend)}
        </span>
        <span className={c.monthlyTrend === "up" ? "text-profit" : c.monthlyTrend === "down" ? "text-loss" : "text-silver-400"}>
          1M {trendIcon(c.monthlyTrend)}
        </span>
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] text-silver-300 leading-relaxed">
          <span className="text-gold-400 font-medium">Driver:</span> {c.drivers}
        </p>
        <p className="text-[11px] text-silver-300 leading-relaxed">
          <span className="text-gold-400 font-medium">Tác động VN:</span> {c.vnImpact}
        </p>
      </div>

      <div className="flex gap-1 mt-2 flex-wrap">
        {c.vnSectors.map((sector) => (
          <span key={sector} className="text-[10px] bg-navy-700/50 text-silver-300 px-1.5 py-0.5 rounded">
            {sector}
          </span>
        ))}
      </div>
    </div>
  );
}

function NewsCard({ n }: { n: NewsItem }) {
  return (
    <div className="glass-card p-3 mb-2">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-semibold text-sm text-silver-100 leading-tight flex-1">{n.headline}</h4>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${impactBg(n.impact)}`}>
          {impactLabel(n.impact)}
        </span>
      </div>
      <p className="text-xs text-silver-300 leading-relaxed mb-2">{n.summary}</p>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gold-500 font-medium">{n.source}</span>
        <span className="text-silver-400">{n.time}</span>
        {n.verified && <span className="text-profit">✓ Đã xác minh</span>}
      </div>
      <div className="flex gap-1 mt-1.5 flex-wrap">
        {n.sectors.map((s) => (
          <span key={s} className="text-[10px] bg-navy-700/50 text-silver-300 px-1.5 py-0.5 rounded">{s}</span>
        ))}
      </div>
    </div>
  );
}

function HeatmapCell({ sector }: { sector: SectorData }) {
  const score = (sector.relativeStrength + sector.momentum + sector.technicalScore) / 3;
  const bgColor = score > 75 ? "rgba(0,200,83,0.25)" : score > 60 ? "rgba(0,200,83,0.12)" : score > 45 ? "rgba(255,214,0,0.15)" : "rgba(255,23,68,0.15)";
  const textColor = score > 75 ? "#00C853" : score > 60 ? "#4CAF50" : score > 45 ? "#FFD600" : "#FF1744";
  return (
    <div className="rounded-lg p-2 text-center" style={{ background: bgColor, border: `1px solid ${textColor}33` }}>
      <div className="font-semibold text-[11px] mb-1" style={{ color: textColor }}>{sector.name}</div>
      <div className="font-bold text-sm" style={{ color: textColor }}>{Math.round(score)}</div>
      <div className="text-[10px] text-silver-400 mt-0.5">
        {sector.capitalFlow === "inflow" ? "🟢 Vào" : sector.capitalFlow === "outflow" ? "🔴 Ra" : "⚪ TL"}
      </div>
    </div>
  );
}

function StockPickCard({ s, idx }: { s: StockPick; idx: number }) {
  const avgScore = Math.round((s.fundamentalScore + s.technicalScore + s.momentumScore + s.valuationScore) / 4);
  return (
    <div className="glass-card-gold p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-gold-500">{s.ticker}</span>
          <span className="text-xs text-silver-300">{s.company}</span>
        </div>
        <span className="text-gold-400 text-sm">{stars(s.stars)}</span>
      </div>
      <div className="text-[10px] text-silver-400 mb-2">
        {s.sector} | Rủi ro: <span className={s.riskScore === "Thấp" ? "text-profit" : s.riskScore === "Cao" ? "text-loss" : "text-warn"}>{s.riskScore}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {[
          { label: "FA", value: s.fundamentalScore },
          { label: "TA", value: s.technicalScore },
          { label: "MOM", value: s.momentumScore },
          { label: "VAL", value: s.valuationScore },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-[10px] text-silver-400">{item.label}</div>
            <div className="relative h-1.5 bg-navy-700 rounded-full mt-0.5 overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${item.value}%`, background: item.value > 75 ? "#00C853" : item.value > 50 ? "#FFD600" : "#FF1744" }} />
            </div>
            <div className="text-xs font-bold mt-0.5" style={{ color: item.value > 75 ? "#00C853" : item.value > 50 ? "#FFD600" : "#FF1744" }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
        <div><span className="text-silver-400">Vùng mua: </span><span className="text-silver-100 font-medium">{s.entryZone}</span></div>
        <div><span className="text-silver-400">Mục tiêu 1: </span><span className="text-profit font-medium">{s.target1}</span></div>
        <div><span className="text-silver-400">Stop loss: </span><span className="text-loss font-medium">{s.stopLoss}</span></div>
        <div><span className="text-silver-400">Mục tiêu 2: </span><span className="text-profit font-medium">{s.target2}</span></div>
      </div>
      <div className="text-[10px] text-silver-400 mb-1"><span className="text-gold-500">Lợi nhuận kỳ vọng:</span> {s.expectedReturn}</div>
      <p className="text-[11px] text-silver-300 leading-relaxed mb-1"><span className="text-gold-500 font-medium">Luận điểm: </span>{s.thesis}</p>
      <p className="text-[10px] text-silver-400"><span className="text-loss">⚠ Rủi ro: </span>{s.risks}</p>
    </div>
  );
}

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  const color = value > 80 ? "#00C853" : value > 60 ? "#4CAF50" : value > 40 ? "#FFD600" : "#FF1744";
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-silver-300">{label}</span>
        <span className="font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>
    </div>
  );
}

/* ─── TABS ─── */
const TABS = [
  "Tổng quan",
  "Vĩ mô",
  "Hàng hóa",
  "Tin tức",
  "Ngành",
  "Kỹ thuật",
  "Chiến lược",
  "Cổ phiếu",
];

/* ─── Main Component ─── */
export function DashboardClient({ data: initialData }: { data: DashboardData }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState(0);
  const [exportMode, setExportMode] = useState(false);
  const [exporting, setExporting] = useState<null | "png" | "pdf">(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastClientRefresh, setLastClientRefresh] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const fileName = `ORCA_FINANCIAL_${data.dateShort.replace(/\//g, "-")}`;

  const refreshDashboard = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard?auto=1", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const nextData = (await res.json()) as DashboardData;
      setData(nextData);
      setLastClientRefresh(new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }));
    } catch (error) {
      console.error("Auto refresh dashboard failed:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void refreshDashboard();

    const intervalId = setInterval(() => void refreshDashboard(), 60 * 60 * 1000);

    const onFocus = () => void refreshDashboard();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
    // Intentionally schedule once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = async (type: "png" | "pdf") => {
    if (exporting) return;
    setExporting(type);
    setExportMode(true);
    // Wait for all sections to render and fade-in animations to settle
    await new Promise((resolve) => setTimeout(resolve, 750));
    try {
      const el = reportRef.current;
      if (el) {
        if (type === "png") {
          await exportToPNG(el, fileName);
        } else {
          await exportToPDF(el, fileName);
        }
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Xuất file thất bại. Vui lòng thử lại.");
    } finally {
      setExportMode(false);
      setExporting(null);
    }
  };

  return (
    <div ref={reportRef} className="w-full max-w-[1500px] mx-auto min-h-screen relative px-0 sm:px-4 lg:px-6">
      {/* Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0" style={{ opacity: 0.03 }}>
        <OrcaLogo size={560} />
      </div>

      {/* Header */}
      <header className="sticky top-0 lg:top-4 z-50 glass-card border-b lg:border border-navy-700/50 px-3 sm:px-4 lg:px-5 py-3 lg:rounded-2xl lg:shadow-2xl lg:shadow-navy-950/30">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <OrcaLogo size={40} />
            <div>
              <h1 className="text-base font-black tracking-wider text-gradient-gold">ORCA FINANCIAL</h1>
              <p className="text-[10px] text-gold-400 tracking-widest">INTELLIGENT INVESTMENT</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 lg:justify-end lg:min-w-[520px]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 text-[11px] lg:text-xs font-semibold text-silver-200 bg-navy-700/60 border border-gold-500/30 hover:bg-navy-600 hover:border-gold-500/50 px-2.5 lg:px-3 py-1.5 rounded-lg transition-all"
                aria-label="Tìm kiếm"
              >
                🔍 <span className="hidden sm:inline">Tìm kiếm</span>
              </button>
              <button
                onClick={() => void refreshDashboard()}
                disabled={refreshing}
                className="flex items-center gap-1 text-[11px] lg:text-xs font-semibold text-silver-200 bg-navy-700/60 border border-profit/30 hover:bg-navy-600 hover:border-profit/50 px-2.5 lg:px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 disabled:cursor-wait"
                aria-label="Làm mới dashboard"
                title="Tự động quét và cập nhật dữ liệu mới mỗi 1 giờ"
              >
                {refreshing ? <span className="inline-block w-3 h-3 border-2 border-silver-100/40 border-t-silver-100 rounded-full animate-spin" /> : "↻"}
                <span className="hidden sm:inline">Auto 1h</span>
              </button>
            </div>
            <div className="text-right max-w-[260px] sm:max-w-none">
              <div className="text-[10px] text-silver-400">{data.timestamp}</div>
              <div className="flex items-center gap-1 mt-0.5 justify-end flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-profit pulse-dot" />
                <span className="text-[10px] text-profit font-medium">LIVE</span>
                <span className="text-[9px] text-gold-400 border border-gold-500/30 rounded px-1 py-0.5">1h</span>
                {lastClientRefresh && <span className="text-[9px] text-silver-400">↻ {lastClientRefresh}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className={`grid grid-cols-2 gap-2 mt-3 lg:max-w-[420px] lg:ml-auto ${exportMode ? "hidden" : ""}`}>
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null}
            className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-lg bg-gold-500 text-navy-900 hover:bg-gold-400 transition-all disabled:opacity-60 disabled:cursor-wait glow-gold"
          >
            {exporting === "pdf" ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-navy-900/40 border-t-navy-900 rounded-full animate-spin" />
                Đang tạo PDF...
              </>
            ) : (
              <>📄 Tải PDF</>
            )}
          </button>
          <button
            onClick={() => handleExport("png")}
            disabled={exporting !== null}
            className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-lg bg-navy-700 text-silver-100 border border-gold-500/40 hover:bg-navy-600 transition-all disabled:opacity-60 disabled:cursor-wait"
          >
            {exporting === "png" ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-silver-100/40 border-t-silver-100 rounded-full animate-spin" />
                Đang tạo PNG...
              </>
            ) : (
              <>🖼️ Tải PNG</>
            )}
          </button>
        </div>

        {/* Quick Search Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className={`w-full lg:max-w-3xl lg:mx-auto flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-navy-800/60 border border-navy-700/60 hover:border-gold-500/40 text-left transition-all ${exportMode ? "hidden" : ""}`}
        >
          <span className="text-gold-500 text-sm">🔍</span>
          <span className="text-[11px] text-silver-400 flex-1">Tìm kiếm nhanh... <span className="font-mono text-silver-400/70">[Thông tin] ngày xx/xx/xxxx</span></span>
          <span className="text-[9px] text-silver-400/60 border border-navy-700 rounded px-1.5 py-0.5">⌘ Tìm</span>
        </button>

        {/* Tab Navigation */}
        <div className={`flex gap-1.5 mt-3 overflow-x-auto lg:overflow-visible lg:flex-wrap lg:justify-center pb-1 -mx-1 px-1 scrollbar-none ${exportMode ? "hidden" : ""}`} style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                activeTab === i
                  ? "bg-gold-500 text-navy-900"
                  : "bg-navy-700/40 text-silver-300 hover:bg-navy-700/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-3 sm:px-0 pb-20 pt-4 lg:pt-5">
        {/* TAB 0: Overview - Sections 1, 11, 12 */}
        {(activeTab === 0 || exportMode) && (
          <div className="animate-fade-in">
            {/* Date Header */}
            <div className="text-center mb-4">
              <h2 className="text-sm font-bold text-gold-500 uppercase tracking-wider">BÁO CÁO TÀI CHÍNH HÀNG NGÀY</h2>
              <p className="text-xs text-silver-300 mt-1">{data.date}</p>
              <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] bg-loss/20 text-loss border border-loss/30 px-2 py-0.5 rounded-full font-medium">🔴 VN-Index mất mốc 1,800</span>
                <span className="text-[10px] bg-warn/20 text-warn border border-warn/30 px-2 py-0.5 rounded-full font-medium">⚠ Chờ CPI Mỹ 10/06</span>
              </div>
            </div>

            {/* Sentiment Gauges */}
            <div className="glass-card-gold p-4 mb-4 glow-gold">
              <div className="text-center mb-3">
                <span className="text-xs text-gold-500 font-semibold tracking-wider">ORCA MARKET PULSE</span>
                <div className="text-lg font-bold text-silver-100 mt-1">{data.orcaPulse}</div>
              </div>
              <div className="flex justify-around">
                <GaugeChart value={data.sentimentScore} label="Tâm lý" />
                <GaugeChart value={data.fearGreedScore} label="Tham lam/Sợ hãi" />
                <GaugeChart value={100 - data.riskScore} label="An toàn" />
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div>
                {/* Section 1: Vietnam Markets */}
                <SectionHeader number="1" title="THỊ TRƯỜNG VIỆT NAM" icon="🇻🇳" />
                <div className="glass-card p-3 mb-4">
                  {data.vietnamMarkets.map((m) => <MarketRow key={m.ticker} m={m} />)}
                </div>
              </div>

              <div>
                {/* Global Markets */}
                <SectionHeader number="" title="THỊ TRƯỜNG TOÀN CẦU" icon="🌍" />
                <div className="glass-card p-3 mb-4">
                  {data.globalMarkets.map((m) => <MarketRow key={m.ticker} m={m} />)}
                </div>
              </div>
            </div>

            {/* Section 11: Executive Summary */}
            <div className="section-divider mb-4" />
            <SectionHeader number="11" title="TÓM TẮT ĐIỀU HÀNH" icon="📋" />
            <div className="glass-card-gold p-4 mb-4">
              <div className="space-y-3">
                <div>
                  <div className="text-[10px] text-gold-500 font-semibold tracking-wider mb-1">🎯 THÔNG ĐIỆP CHÍNH</div>
                  <p className="text-xs text-silver-200 leading-relaxed">{data.executiveSummary.keyMessage}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[10px] text-profit font-semibold mb-1">💎 CƠ HỘI LỚN NHẤT</div>
                    <p className="text-[11px] text-silver-300 leading-relaxed">{data.executiveSummary.biggestOpportunity}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-loss font-semibold mb-1">⚠️ RỦI RO LỚN NHẤT</div>
                    <p className="text-[11px] text-silver-300 leading-relaxed">{data.executiveSummary.biggestRisk}</p>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-[10px] text-gold-400 font-semibold mb-1">🔍 NGÀNH THEO DÕI</div>
                    <p className="text-xs text-silver-200 font-medium">{data.executiveSummary.sectorToWatch}</p>
                  </div>
                  <div>
                    <div className="text-[10px] text-gold-400 font-semibold mb-1">⭐ CỔ PHIẾU THEO DÕI</div>
                    <p className="text-xs text-silver-200 font-medium">{data.executiveSummary.stockToWatch}</p>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-navy-500 font-semibold mb-1">📊 TRIỂN VỌNG PHIÊN SAU</div>
                  <p className="text-xs text-silver-200 leading-relaxed">{data.executiveSummary.nextDayOutlook}</p>
                </div>
              </div>
            </div>

            {/* Section 12: AI Confidence */}
            <SectionHeader number="12" title="ORCA AI CONFIDENCE" icon="🤖" />
            <div className="glass-card p-4 mb-4">
              <ConfidenceBar label="Độ tin cậy dữ liệu" value={data.confidenceScores.dataReliability} />
              <ConfidenceBar label="Phân tích vĩ mô" value={data.confidenceScores.macroConfidence} />
              <ConfidenceBar label="Phân tích kỹ thuật" value={data.confidenceScores.technicalConfidence} />
              <ConfidenceBar label="Chiến lược" value={data.confidenceScores.strategyConfidence} />
              <div className="mt-3 pt-3 border-t border-navy-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gold-500">TỔNG ĐIỂM TIN CẬY</span>
                  <span className="text-2xl font-black text-gold-400">{data.confidenceScores.overallConfidence}%</span>
                </div>
                <p className="text-[10px] text-silver-400 mt-2 leading-relaxed">{data.confidenceScores.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: Macro - Sections 2 */}
        {(activeTab === 1 || exportMode) && (
          <div className="animate-fade-in grid gap-4 xl:grid-cols-2">
            <div>
              <SectionHeader number="2" title="KINH TẾ VĨ MÔ VIỆT NAM" icon="🇻🇳" />
              <div className="glass-card p-3 mb-4">
                {data.vietnamMacro.map((m) => (
                  <div key={m.name} className="flex items-center justify-between py-2 border-b border-navy-700/30 last:border-0">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-silver-200">{m.name}</div>
                      <div className="text-[10px] text-silver-400">{m.impact}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-sm font-bold text-silver-100">{m.latestValue} <span className="text-[10px] text-silver-400">{m.unit}</span></div>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[10px] text-silver-400">Trước: {m.previousValue}</span>
                        <span className={`text-xs ${m.trend === "up" ? "text-profit" : m.trend === "down" ? "text-loss" : "text-silver-400"}`}>
                          {trendIcon(m.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader number="" title="KINH TẾ VĨ MÔ TOÀN CẦU" icon="🌍" />
              <div className="glass-card p-3 mb-4">
                {data.globalMacro.map((m) => (
                  <div key={m.name} className="flex items-center justify-between py-2 border-b border-navy-700/30 last:border-0">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-silver-200">{m.name}</div>
                      <div className="text-[10px] text-silver-400">{m.impact}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-sm font-bold text-silver-100">{m.latestValue} <span className="text-[10px] text-silver-400">{m.unit}</span></div>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[10px] text-silver-400">Trước: {m.previousValue}</span>
                        <span className={`text-xs ${m.trend === "up" ? "text-profit" : m.trend === "down" ? "text-loss" : "text-silver-400"}`}>
                          {trendIcon(m.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Commodities - Section 3 */}
        {(activeTab === 2 || exportMode) && (
          <div className="animate-fade-in">
            <SectionHeader number="3" title="THEO DÕI HÀNG HÓA" icon="📦" />

            <div className="glass-card-gold p-3 mb-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gold-500 tracking-wider">COMMODITIES INTELLIGENCE</div>
                  <div className="text-[11px] text-silver-300 mt-1">
                    Mở rộng theo dõi <span className="text-gold-400 font-bold">{data.commodities.length}</span> mặt hàng với dữ liệu giá, biến động D/W/M/YTD, driver và tác động tới ngành tại Việt Nam.
                  </div>
                </div>
              </div>
            </div>
            
            {[
              "Năng lượng",
              "Kim loại quý",
              "Kim loại cơ bản",
              "Nguyên liệu công nghiệp",
              "Nông sản & softs",
            ].map((cat) => {
              const items = data.commodities.filter((c) => c.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="mb-4">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="text-xs font-semibold text-gold-500 tracking-wider">{cat.toUpperCase()}</div>
                    <div className="text-[10px] text-silver-400">{items.length} mặt hàng</div>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {items.map((c) => <CommodityCard key={c.name} c={c} />)}
                  </div>
                </div>
              );
            })}

            {/* Key commodity impacts */}
            <div className="glass-card-gold p-3 mt-2">
              <div className="text-xs font-semibold text-gold-500 mb-2">TÁC ĐỘNG NỔI BẬT ĐẾN TTCK VIỆT NAM</div>
              {data.commodities
                .filter((c) => ["Dầu Brent", "Quặng sắt", "Vàng spot", "Cà phê Robusta", "Gạo rough rice", "Bông"].includes(c.name))
                .map((c) => (
                  <div key={c.name} className="text-[11px] text-silver-300 mb-2 leading-relaxed">
                    <span className="text-gold-400 font-medium">{c.name}: </span>{c.vnImpact}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: News - Sections 4, 5, 6 */}
        {(activeTab === 3 || exportMode) && (
          <div className="animate-fade-in grid gap-4 xl:grid-cols-3">
            <div>
              <SectionHeader number="4" title="TIN VĨ MÔ QUỐC TẾ" icon="🌐" />
              <div className="mb-4">
                {data.globalNews.map((n, i) => <NewsCard key={i} n={n} />)}
              </div>
            </div>

            <div>
              <SectionHeader number="5" title="TIN VĨ MÔ VIỆT NAM" icon="🇻🇳" />
              <div className="mb-4">
                {data.vietnamNews.map((n, i) => <NewsCard key={i} n={n} />)}
              </div>
            </div>

            <div>
              <SectionHeader number="6" title="TIN DOANH NGHIỆP QUAN TRỌNG" icon="🏢" />
              <div className="mb-4">
                {data.corporateNews.map((n, i) => <NewsCard key={i} n={n} />)}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Sectors - Section 7 */}
        {(activeTab === 4 || exportMode) && (
          <div className="animate-fade-in">
            <SectionHeader number="7" title="PHÂN TÍCH LUÂN CHUYỂN NGÀNH" icon="🔄" />
            
            {/* Heatmap */}
            <div className="glass-card p-3 mb-4">
              <div className="text-[10px] text-silver-400 mb-2 text-center font-medium">HEATMAP ĐIỂM SỐ TỔNG HỢP</div>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4 xl:grid-cols-6">
                {data.sectors.map((s) => <HeatmapCell key={s.name} sector={s} />)}
              </div>
            </div>

            {/* Detailed sector table */}
            <div className="glass-card p-3 mb-4">
              <div className="text-[10px] text-silver-400 mb-2 font-medium">CHI TIẾT TỪNG NGÀNH</div>
              <div className="overflow-x-auto">
                <div className="min-w-[400px]">
                  <div className="grid grid-cols-6 gap-1 text-[10px] text-silver-400 font-medium pb-2 border-b border-navy-700/30 mb-1">
                    <span className="col-span-1">Ngành</span>
                    <span className="text-center">RS</span>
                    <span className="text-center">Dòng tiền</span>
                    <span className="text-center">Đà tăng</span>
                    <span className="text-center">Định giá</span>
                    <span className="text-center">TA</span>
                  </div>
                  {data.sectors.map((s) => (
                    <div key={s.name} className="grid grid-cols-6 gap-1 text-xs py-1.5 border-b border-navy-700/20">
                      <span className="text-silver-200 font-medium truncate">{s.name}</span>
                      <span className={`text-center font-bold ${s.relativeStrength > 70 ? "text-profit" : s.relativeStrength > 50 ? "text-warn" : "text-loss"}`}>{s.relativeStrength}</span>
                      <span className={`text-center text-[11px] ${s.capitalFlow === "inflow" ? "text-profit" : s.capitalFlow === "outflow" ? "text-loss" : "text-silver-400"}`}>
                        {s.capitalFlow === "inflow" ? "⬆ Vào" : s.capitalFlow === "outflow" ? "⬇ Ra" : "— TL"}
                      </span>
                      <span className={`text-center font-bold ${s.momentum > 70 ? "text-profit" : s.momentum > 50 ? "text-warn" : "text-loss"}`}>{s.momentum}</span>
                      <span className={`text-center text-[11px] ${s.valuation === "attractive" ? "text-profit" : s.valuation === "expensive" ? "text-loss" : "text-warn"}`}>
                        {s.valuation === "attractive" ? "Hấp dẫn" : s.valuation === "expensive" ? "Đắt" : "Hợp lý"}
                      </span>
                      <span className={`text-center font-bold ${s.technicalScore > 70 ? "text-profit" : s.technicalScore > 50 ? "text-warn" : "text-loss"}`}>{s.technicalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Technical - Section 8 */}
        {(activeTab === 5 || exportMode) && (
          <div className="animate-fade-in">
            <SectionHeader number="8" title="PHÂN TÍCH KỸ THUẬT" icon="📈" />

            <div className="grid gap-4 xl:grid-cols-2">
            {(["vnindex", "vn30"] as const).map((idx) => {
              const ta = data.technicalAnalysis[idx];
              const label = idx === "vnindex" ? "VNINDEX" : "VN30";
              return (
                <div key={idx} className="glass-card-gold p-4 mb-4">
                  <h3 className="text-base font-bold text-gold-500 mb-3">{label}</h3>
                  
                  {/* Moving Averages */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "MA20", value: ta.ma20 },
                      { label: "MA50", value: ta.ma50 },
                      { label: "MA200", value: ta.ma200 },
                    ].map((ma) => (
                      <div key={ma.label} className="bg-navy-800/50 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-silver-400">{ma.label}</div>
                        <div className="text-xs font-bold text-silver-100">{fmt(ma.value)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Indicators */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-navy-800/50 rounded-lg p-2">
                      <div className="text-[10px] text-silver-400">RSI (14)</div>
                      <div className={`text-sm font-bold ${ta.rsi > 70 ? "text-loss" : ta.rsi < 30 ? "text-profit" : "text-warn"}`}>{ta.rsi}</div>
                      <div className="h-1.5 bg-navy-700 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${ta.rsi}%`, background: ta.rsi > 70 ? "#FF1744" : ta.rsi < 30 ? "#00C853" : "#FFD600" }} />
                      </div>
                    </div>
                    <div className="bg-navy-800/50 rounded-lg p-2">
                      <div className="text-[10px] text-silver-400">ADX</div>
                      <div className={`text-sm font-bold ${ta.adx > 25 ? "text-profit" : "text-silver-300"}`}>{ta.adx}</div>
                      <div className="text-[10px] text-silver-400 mt-0.5">{ta.adx > 25 ? "Xu hướng mạnh" : "Xu hướng yếu"}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-navy-800/50 rounded-lg p-2">
                      <div className="text-[10px] text-silver-400">MACD</div>
                      <div className="text-xs font-medium text-profit">{ta.macd}</div>
                    </div>
                    <div className="bg-navy-800/50 rounded-lg p-2">
                      <div className="text-[10px] text-silver-400">Bollinger</div>
                      <div className="text-[11px] text-silver-200">{fmt(ta.bollingerUpper)} / {fmt(ta.bollingerLower)}</div>
                    </div>
                  </div>

                  {/* Breadth */}
                  <div className="bg-navy-800/50 rounded-lg p-2 mb-3">
                    <div className="text-[10px] text-silver-400">Độ rộng thị trường</div>
                    <div className="text-xs text-silver-200 font-medium">{ta.breadth}</div>
                  </div>

                  {/* Support & Resistance */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="text-[10px] text-profit font-semibold mb-1">HỖ TRỢ</div>
                      {ta.supports.map((s, i) => (
                        <div key={i} className="text-xs text-silver-200 mb-0.5">S{i + 1}: <span className="font-bold text-profit">{fmt(s)}</span></div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[10px] text-loss font-semibold mb-1">KHÁNG CỰ</div>
                      {ta.resistances.map((r, i) => (
                        <div key={i} className="text-xs text-silver-200 mb-0.5">R{i + 1}: <span className="font-bold text-loss">{fmt(r)}</span></div>
                      ))}
                    </div>
                  </div>

                  {/* Outlook */}
                  <div className="space-y-2">
                    <div>
                      <div className="text-[10px] text-gold-500 font-semibold">TRIỂN VỌNG NGẮN HẠN</div>
                      <p className="text-[11px] text-silver-300">{ta.shortTermOutlook}</p>
                    </div>
                    <div>
                      <div className="text-[10px] text-gold-500 font-semibold">TRIỂN VỌNG TRUNG HẠN</div>
                      <p className="text-[11px] text-silver-300">{ta.mediumTermOutlook}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-navy-700/30">
                      <span className="text-[10px] text-silver-400">Xác suất tăng:</span>
                      <span className="text-sm font-bold text-gold-400">{ta.probabilityScore}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* TAB 6: Strategy - Section 9 */}
        {(activeTab === 6 || exportMode) && (
          <div className="animate-fade-in">
            <SectionHeader number="9" title="CHIẾN LƯỢC ORCA HÀNG NGÀY" icon="🎯" />
            
            {/* Market Regime */}
            <div className="glass-card-gold p-4 mb-4 glow-gold text-center">
              <div className="text-[10px] text-gold-500 font-semibold tracking-wider mb-1">CHẾ ĐỘ THỊ TRƯỜNG HIỆN TẠI</div>
              <div className="text-xl font-black text-gold-400">{data.strategy.regime}</div>
            </div>

            {/* Allocation */}
            <div className="glass-card p-4 mb-4">
              <div className="text-xs font-semibold text-gold-500 mb-3">PHÂN BỔ TÀI SẢN KHUYẾN NGHỊ</div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Cổ phiếu", pct: data.strategy.stocksPct, color: "#00C853", icon: "📈" },
                  { label: "Tiền mặt", pct: data.strategy.cashPct, color: "#9CA3AF", icon: "💵" },
                  { label: "Trái phiếu", pct: data.strategy.bondsPct, color: "#2196F3", icon: "📄" },
                  { label: "Vàng", pct: data.strategy.goldPct, color: "#D4AF37", icon: "🪙" },
                ].map((a) => (
                  <div key={a.label} className="text-center">
                    <div className="text-lg mb-0.5">{a.icon}</div>
                    <div className="relative w-14 h-14 mx-auto mb-1">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(31,78,121,0.3)" strokeWidth="3" />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={a.color}
                          strokeWidth="3"
                          strokeDasharray={`${a.pct}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold" style={{ color: a.color }}>{a.pct}%</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-silver-300 font-medium">{a.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Sectors */}
            <div className="glass-card p-3 mb-4">
              <div className="text-xs font-semibold text-gold-500 mb-2">NGÀNH KHUYẾN NGHỊ</div>
              <div className="flex flex-wrap gap-1.5">
                {data.strategy.recommendedSectors.map((s) => (
                  <span key={s} className="text-[11px] bg-profit/15 text-profit border border-profit/30 px-2.5 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>

            {/* Trading Themes */}
            <div className="glass-card p-3 mb-4">
              <div className="text-xs font-semibold text-gold-500 mb-2">CHỦ ĐỀ GIAO DỊCH</div>
              {data.strategy.tradingThemes.map((t, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="text-gold-400 text-xs mt-0.5">▸</span>
                  <span className="text-[11px] text-silver-200">{t}</span>
                </div>
              ))}
            </div>

            {/* Catalysts */}
            <div className="glass-card p-3 mb-4">
              <div className="text-xs font-semibold text-gold-500 mb-2">XÚC TÁC THEO DÕI</div>
              {data.strategy.catalysts.map((c, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <span className="text-warn text-xs mt-0.5">⚡</span>
                  <span className="text-[11px] text-silver-200">{c}</span>
                </div>
              ))}
            </div>

            {/* Risk Management */}
            <div className="glass-card-gold p-3 mb-4">
              <div className="text-xs font-semibold text-loss mb-2">⚠️ QUẢN LÝ RỦI RO</div>
              <p className="text-[11px] text-silver-300 leading-relaxed">{data.strategy.riskGuidance}</p>
            </div>
          </div>
        )}

        {/* TAB 7: Stock Picks - Section 10 */}
        {(activeTab === 7 || exportMode) && (
          <div className="animate-fade-in">
            <SectionHeader number="10" title="KHUYẾN NGHỊ CỔ PHIẾU ORCA" icon="⭐" />
            <div className="text-[10px] text-silver-400 mb-3 text-center">Top 5 cổ phiếu đáp ứng tiêu chí: Thanh khoản tốt • Định giá hấp dẫn • Kỹ thuật tích cực • Xúc tác rõ ràng</div>
            <div className="grid gap-3 xl:grid-cols-2">
              {data.stockPicks.map((s, i) => <StockPickCard key={s.ticker} s={s} idx={i} />)}
            </div>

            <div className="glass-card p-3 mt-2">
              <div className="text-[10px] text-silver-400 text-center leading-relaxed">
                <span className="text-loss font-medium">⚠️ KHUYẾN CÁO:</span> Thông tin chỉ mang tính tham khảo, không phải lời khuyên đầu tư. Nhà đầu tư cần tự đánh giá và chịu trách nhiệm với quyết định của mình.
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-navy-700/30">
          <div className="text-center">
            <OrcaLogo size={32} />
            <p className="text-xs font-bold text-gold-500 mt-2">ORCA FINANCIAL</p>
            <p className="text-[10px] text-gold-400">Intelligent Investment</p>
            <p className="text-[10px] text-silver-400 mt-2">Nguyễn Hồng Quân - 0974135578</p>
            <p className="text-[10px] text-silver-400 mt-1">
              © {new Date().getFullYear()} ORCA FINANCIAL. All rights reserved.
            </p>
            <p className="text-[9px] text-silver-400/60 mt-2 leading-relaxed max-w-xs mx-auto">
              Bản tin này được tổng hợp từ các nguồn đáng tin cậy. Thông tin chỉ mang tính chất tham khảo, không phải lời khuyên đầu tư.
              Nguồn: Bloomberg, Reuters, FT, WSJ, CNBC, NHNN, TCTK, HOSE, HNX, Vietstock, CafeF.
            </p>
          </div>
        </footer>
      </main>

      {/* Search Overlay */}
      <SearchOverlay
        data={data}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
