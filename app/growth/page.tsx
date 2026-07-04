// app/growth/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GrowthCard from "@/components/ui/GrowthCard";
import MoodTimeline from "@/components/ui/MoodTimeline";
import type { GrowthStats, DayMood } from "@/lib/progress";

interface ProgressResponse {
  streak: number;
  weeklyMood: DayMood[];
  growth: GrowthStats;
}

export default function GrowthPage() {
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setErrored(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#171321] via-[#15111F] to-[#13111C] px-6 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>

        <h1 className="bg-gradient-to-r from-violet-200 via-pink-300 to-fuchsia-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          Growth Insight
        </h1>
        <p className="mt-1 text-sm text-white/45">
          Lihat gimana mood kamu bergerak dari waktu ke waktu.
        </p>

        <div className="mt-8 space-y-6">
          {loading && (
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
              <div className="h-20 animate-pulse rounded-3xl bg-white/5" />
            </div>
          )}

          {!loading && errored && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
              Belum bisa ambil data progress kamu. Coba refresh halaman ini.
            </div>
          )}

          {!loading && !errored && data && (
            <>
              <GrowthCard growth={data.growth} />

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="mb-4 text-sm text-white/50">7 Hari Terakhir</p>
                <MoodTimeline days={data.weeklyMood} />
              </div>

              <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-5">
                <p className="flex items-center gap-2 text-sm text-white/50">
                  🔥 Current Streak
                </p>
                <h3 className="mt-1 text-2xl font-bold">{data.streak} Hari</h3>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}