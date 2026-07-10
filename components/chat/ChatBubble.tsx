"use client";

import { Bot, User } from "lucide-react";
import MoodReaction from "./MoodReaction";

interface ChatBubbleProps {
  id: string;
  content: string;
  role: "user" | "meemo";
  created_at?: string;
  mood?: string | null;
  conversationId: string;
  onMoodChange?: (messageId: string, mood: string) => void;
}

export default function ChatBubble({
  id,
  content,
  role,
  created_at,
  mood,
  conversationId,
  onMoodChange,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`group flex w-full gap-2 sm:gap-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-violet-500/30 sm:h-11 sm:w-11">
          <Bot size={18} className="text-white sm:hidden" />
          <Bot size={20} className="hidden text-white sm:block" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[70%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <span className="mb-2 px-1 text-xs font-medium text-white/35">
          {isUser ? "You" : "Meemo"}
        </span>

        <div
          className={`rounded-3xl px-4 py-3 transition-all duration-300 sm:px-5 sm:py-4 ${
            isUser
              ? "rounded-br-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/25"
              : "rounded-bl-lg border border-white/10 bg-white/5 text-white backdrop-blur-xl"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-6 sm:text-[15px] sm:leading-8">
            {content}
          </p>
        </div>

        <div className="mt-2 flex w-full items-center justify-between px-2">
          <span className="text-[11px] text-white/30">
            {created_at &&
              new Date(created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
          </span>

          {isUser && (
            <div className="opacity-100 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100">
              <MoodReaction
                messageId={id}
                conversationId={conversationId}
                currentMood={mood}
                onMoodChange={(newMood) => onMoodChange?.(id, newMood)}
              />
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:h-11 sm:w-11">
          <User size={16} className="text-white/80 sm:hidden" />
          <User size={18} className="hidden text-white/80 sm:block" />
        </div>
      )}
    </div>
  );
}