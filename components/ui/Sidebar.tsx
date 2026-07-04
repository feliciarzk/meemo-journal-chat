"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  MessageCircle,
  ChartNoAxesColumn,
  Mail,
} from "lucide-react";
import MoodTimeline from "@/components/ui/MoodTimeline";
import type { DayMood } from "@/lib/progress";

interface Conversation {
  id: string;
  conversation_date: string;
  title: string | null;
  preview?: string;
  mood?: string;
}

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

interface ProgressData {
  weeklyMood: DayMood[];
}

function dateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatJournalLabel(dateStr: string): string {
  const today = dateKey(new Date());
  const yesterday = dateKey(
    new Date(new Date().setDate(new Date().getDate() - 1))
  );

  if (dateStr === today) return "Today's Journal";
  if (dateStr === yesterday) return "Yesterday's Journal";

  const date = new Date(dateStr);
  return `Journal - ${date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  collapsed,
  onToggle,
}: SidebarProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setProgress({ weeklyMood: data.weeklyMood });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingProgress(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside
      className={`flex h-screen flex-col border-r border-white/10 bg-gradient-to-b from-[#171321] via-[#15111F] to-[#13111C] transition-all duration-300 ${
        collapsed ? "w-20" : "w-80"
      }`}
    >
      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between px-5 py-6">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
              <MessageCircle size={23} className="text-white" />
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-violet-200 via-pink-300 to-fuchsia-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
                Meemo
              </h1>
              <p className="text-xs text-white/45">Your safe place to talk.</p>
            </div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="rounded-xl p-2 transition hover:bg-white/10"
        >
          <Menu className="text-white" size={22} />
        </button>
      </div>

      {!collapsed && (
        <>
          {/* WEEKLY MOOD (streak dihapus sesuai request) */}

          <div className="mx-5 mt-2 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">Weekly Mood</p>
            <div className="mt-3">
              {loadingProgress ? (
                <div className="h-10 animate-pulse rounded bg-white/10" />
              ) : (
                <MoodTimeline days={progress?.weeklyMood ?? []} />
              )}
            </div>
          </div>

          {/* JOURNAL HISTORY */}

          <p className="mt-7 px-5 text-xs font-semibold uppercase tracking-[0.35em] text-white/35">
            Conversations
          </p>

          <div className="mt-3 flex-1 space-y-3 overflow-y-auto px-4">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;
              const isToday = conversation.conversation_date === dateKey(new Date());

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-violet-500/40 bg-white/[0.06]"
                      : "border-transparent bg-white/[0.03] hover:border-violet-500/30 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-lg">
                      {conversation.mood ?? "💜"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {formatJournalLabel(conversation.conversation_date)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-white/45">
                        {conversation.preview ??
                          (isToday ? "Continue conversation" : "View conversation")}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* FEATURES */}

          <div className="mx-5 mb-5 grid grid-cols-2 gap-3">
            <Link
              href="/growth"
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 text-center transition hover:bg-white/10"
            >
              <ChartNoAxesColumn size={20} className="text-violet-300" />
              <div>
                <p className="text-sm font-medium">Growth Insight</p>
                <span className="text-[11px] text-white/45">
                  See how you've grown.
                </span>
              </div>
            </Link>

            <Link
              href="/future-me"
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-4 text-center transition hover:bg-white/10"
            >
              <Mail size={20} className="text-cyan-300" />
              <div>
                <p className="text-sm font-medium">Future Me</p>
                <span className="text-[11px] text-white/45">
                  Write a letter to yourself.
                </span>
              </div>
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}