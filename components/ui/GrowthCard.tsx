"use client";

import { ChartNoAxesColumn, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { GrowthStats } from "@/lib/progress";

interface GrowthCardProps {
  growth: GrowthStats;
}

const TREND_ICON = {
  naik: <TrendingUp size={16} className="text-emerald-400" />,
  turun: <TrendingDown size={16} className="text-rose-400" />,
  stabil: <Minus size={16} className="text-white/50" />,
  "belum-cukup-data": <Minus size={16} className="text-white/30" />,
};

export default function GrowthCard({ growth }: GrowthCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15">
          <ChartNoAxesColumn size={18} className="text-violet-300" />
        </div>
        <div>
          <p className="font-semibold text-white">Growth Insight</p>
          <p className="text-xs text-white/45">30 hari terakhir</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-6">
        <div>
          <p className="text-2xl font-bold text-white">
            {growth.totalEntries30d}
          </p>
          <p className="text-xs text-white/45">Entri</p>
        </div>
        <div>
          <p className="text-2xl">{growth.topMood ?? "—"}</p>
          <p className="text-xs text-white/45">Mood dominan</p>
        </div>
        <div className="flex items-center gap-1.5">
          {TREND_ICON[growth.trend]}
          <span className="text-xs capitalize text-white/60">
            {growth.trend.replace(/-/g, " ")}
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-white/70">
        {growth.insightMessage}
      </p>
    </div>
  );
}