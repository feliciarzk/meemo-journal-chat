"use client";

import { Bot } from "lucide-react";

export default function TypingBubble() {
  return (
    <div className="flex w-full justify-start gap-4 animate-in fade-in duration-300">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
        <Bot size={20} className="text-white" />
      </div>

      <div className="flex flex-col">
        <span className="mb-2 text-xs font-medium text-white/35">
          Meemo
        </span>

        <div className="rounded-3xl rounded-bl-lg border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400" />
          </div>
        </div>
      </div>
    </div>
  );
}