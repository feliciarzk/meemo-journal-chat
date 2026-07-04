"use client";

import { useState } from "react";
import { updateMessageMood } from "@/lib/services/message";
import { updateMood } from "@/lib/services/conversation";

const MOODS = ["😄", "🙂", "😐", "😔", "😭"];

interface MoodReactionProps {
  messageId: string;
  conversationId: string;
  currentMood?: string | null;
  onMoodChange?: (mood: string) => void;
}

export default function MoodReaction({
  messageId,
  conversationId,
  currentMood,
  onMoodChange,
}: MoodReactionProps) {
  const [saving, setSaving] = useState(false);

  async function handlePick(mood: string) {
    if (saving) return;
    setSaving(true);

    // optimistic update — biar kerasa instan, gak nunggu network
    onMoodChange?.(mood);

    try {
      await updateMessageMood(messageId, mood);
      // mood hari ini (di conversations) ngikut reaction paling terakhir,
      // soalnya mood emang bisa berubah-ubah dalam satu hari.
      await updateMood(conversationId, mood);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {MOODS.map((mood) => {
        const isActive = currentMood === mood;
        return (
          <button
            key={mood}
            onClick={() => handlePick(mood)}
            disabled={saving}
            className={`rounded-lg p-1.5 text-base transition hover:scale-110 hover:bg-white/10 ${
              isActive ? "bg-white/10 ring-1 ring-violet-400/60" : ""
            } ${saving ? "opacity-50" : ""}`}
            title={mood}
          >
            {mood}
          </button>
        );
      })}
    </div>
  );
}