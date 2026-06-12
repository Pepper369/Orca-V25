"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import type { DashboardData } from "@/lib/dashboard-data";
import { buildSearchIndex, searchIndex, type SearchItem } from "@/lib/search-index";

const QUICK_FILTERS = [
  "Cổ phiếu",
  "Tin Việt Nam",
  "Tin quốc tế",
  "Dầu khí",
  "Ngân hàng",
  "Vàng",
  "Lạm phát",
  "VNINDEX",
];

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0 || !text) return <>{text}</>;
  // Build a case-insensitive regex from terms (escape special chars)
  const escaped = terms
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return <>{text}</>;
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        re.test(part) ? (
          <mark key={i} className="bg-gold-500/40 text-gold-300 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export function SearchOverlay({
  data,
  open,
  onClose,
  onNavigate,
}: {
  data: DashboardData;
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: number) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildSearchIndex(data), [data]);
  const results = useMemo(() => searchIndex(index, query), [index, query]);

  const termsForHighlight = useMemo(() => {
    return query
      .replace(/[[\]]/g, " ")
      .replace(/(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2,4}))?/g, "$&")
      .split(/\s+/)
      .filter((w) => w.length > 1);
  }, [query]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[1120px] h-full flex flex-col px-0 lg:px-4">
        {/* Search bar */}
        <div className="glass-card-gold m-3 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-gold-500 text-lg">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="[Thông tin] ngày 03/06/2026"
              className="flex-1 bg-transparent text-silver-100 text-sm placeholder:text-silver-400/60 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-silver-400 hover:text-silver-100 text-xs px-1.5"
                aria-label="Xóa"
              >
                ✕
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[11px] font-semibold text-navy-900 bg-gold-500 hover:bg-gold-400 px-3 py-1.5 rounded-lg transition-all"
            >
              Đóng
            </button>
          </div>

          {/* Quick filters */}
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {QUICK_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setQuery(f)}
                className="text-[10px] font-medium whitespace-nowrap px-2.5 py-1 rounded-full bg-navy-700/50 text-silver-300 hover:bg-navy-600 hover:text-silver-100 transition-all"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-3 pb-6">
          {query.trim() === "" ? (
            <div className="text-center mt-12 px-6">
              <div className="text-4xl mb-3">🔎</div>
              <p className="text-sm text-silver-300 font-medium mb-2">Tìm kiếm nhanh trong bản tin</p>
              <p className="text-xs text-silver-400 leading-relaxed">
                Nhập từ khóa hoặc dùng cú pháp:
                <br />
                <span className="text-gold-400 font-mono">[Thông tin] ngày xx/xx/xxxx</span>
              </p>
              <div className="mt-4 text-[11px] text-silver-400 space-y-1 text-left max-w-xs mx-auto">
                <p>Ví dụ:</p>
                <p className="text-gold-300">• <span className="font-mono">dầu khí ngày 03/06/2026</span></p>
                <p className="text-gold-300">• <span className="font-mono">VNINDEX</span></p>
                <p className="text-gold-300">• <span className="font-mono">lạm phát</span></p>
                <p className="text-gold-300">• <span className="font-mono">PVD</span></p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center mt-12">
              <div className="text-3xl mb-2">😕</div>
              <p className="text-sm text-silver-300">Không tìm thấy kết quả cho</p>
              <p className="text-sm text-gold-400 font-medium mt-1">&ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <>
              <div className="text-[11px] text-silver-400 mb-2 px-1">
                Tìm thấy <span className="text-gold-400 font-bold">{results.length}</span> kết quả
              </div>
              <div className="grid gap-2 lg:grid-cols-2">
                {results.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onNavigate(item.tab);
                      onClose();
                    }}
                    className="w-full text-left glass-card p-3 hover:border-gold-500/50 transition-all"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">{item.categoryIcon}</span>
                      <span className="text-[10px] font-semibold text-gold-500 uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-silver-100 leading-tight">
                      <Highlight text={item.title} terms={termsForHighlight} />
                    </div>
                    {item.subtitle && (
                      <div className="text-[11px] text-silver-300 mt-0.5">
                        <Highlight text={item.subtitle} terms={termsForHighlight} />
                      </div>
                    )}
                    {item.detail && (
                      <div className="text-[11px] text-silver-400 mt-1 leading-relaxed line-clamp-2">
                        <Highlight text={item.detail} terms={termsForHighlight} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
