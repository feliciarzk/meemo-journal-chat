"use client";

import { useRef, useState } from "react";
import { Send, Smile } from "lucide-react";

const moods = [
  { value: "buruk", emoji: "😞" },
  { value: "kurang", emoji: "😕" },
  { value: "biasa", emoji: "😐" },
  { value: "baik", emoji: "🙂" },
  { value: "sangat_baik", emoji: "😄" },
];

interface Props {
  onSend: (content: string, mood: string | null) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = value.trim();

    if (!trimmed || sending) return;

    setSending(true);

    try {
      await onSend(trimmed, mood);

      setValue("");
      setMood(null);

      if (textareaRef.current) {
        textareaRef.current.style.height = "48px";
      }
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  function handleResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);

    e.target.style.height = "48px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  const selectedEmoji =
    moods.find((m) => m.value === mood)?.emoji ?? "🙂";

  return (
    <div className="relative">
      {pickerOpen && (
        <div className="absolute bottom-16 left-0 flex gap-1 rounded-2xl border border-white/10 bg-[#1A1625] p-2 shadow-2xl backdrop-blur-xl sm:bottom-20 sm:gap-2 sm:p-3">
          {moods.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => {
                setMood(m.value === mood ? null : m.value);
                setPickerOpen(false);
              }}
              className={`rounded-xl p-1.5 text-lg transition hover:scale-110 hover:bg-white/10 sm:p-2 sm:text-xl ${
                mood === m.value ? "bg-violet-500/20" : ""
              }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 rounded-3xl border border-white/10 bg-[#1A1625]/90 p-2 backdrop-blur-xl sm:gap-3 sm:p-3"
      >
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-white transition hover:bg-white/10 sm:h-12 sm:w-12"
        >
          {mood ? (
            <span className="text-lg sm:text-xl">{selectedEmoji}</span>
          ) : (
            <Smile size={20} />
          )}
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleResize}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Write what's on your mind..."
          className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-1 py-3 text-sm leading-6 text-white placeholder:text-white/35 focus:outline-none sm:max-h-40 sm:min-h-[56px] sm:px-2 sm:py-4 sm:text-[15px]"
        />

        <button
          type="submit"
          disabled={!value.trim() || sending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 sm:h-12 sm:w-12"
        >
          {sending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
}