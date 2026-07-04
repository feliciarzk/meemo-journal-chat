"use client";

import type { DayMood } from "@/lib/progress";

interface MoodTimelineProps {
  days: DayMood[]; // 7 hari, urut dari yang paling lama ke hari ini
}

const DAY_LABEL = ["M", "S", "S", "R", "K", "J", "S"]; // Min-Sab, sesuaikan locale kamu

export default function MoodTimeline({ days }: MoodTimelineProps) {
  const todayKey = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex justify-between">
      {days.map((day) => {
        const isToday = day.date === todayKey;
        const dow = new Date(day.date).getDay();

        return (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-base transition ${
                day.mood
                  ? "bg-white/10"
                  : "border border-dashed border-white/15 bg-transparent"
              } ${isToday ? "ring-2 ring-violet-400/70" : ""}`}
              title={day.date}
            >
              {day.mood ?? ""}
            </div>
            <span
              className={`text-[10px] ${
                isToday ? "font-semibold text-violet-300" : "text-white/35"
              }`}
            >
              {DAY_LABEL[dow]}
            </span>
          </div>
        );
      })}
    </div>
  );
}