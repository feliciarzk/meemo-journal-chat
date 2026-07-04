// app/future-me/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  createFutureLetter,
  getFutureLetters,
  FutureLetter,
} from "@/lib/services/futureLetters";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function daysUntil(dateStr: string) {
  const diff =
    new Date(dateStr).getTime() - new Date(todayStr()).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function FutureMePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [letters, setLetters] = useState<FutureLetter[]>([]);
  const [content, setContent] = useState("");
  const [unlockDate, setUnlockDate] = useState(tomorrowStr());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [openedLetter, setOpenedLetter] = useState<FutureLetter | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);
      const data = await getFutureLetters(user.id);
      setLetters(data);
      setLoading(false);
    }

    load();
  }, []);

  async function handleSubmit() {
    if (!userId || !content.trim() || sending) return;

    setSending(true);
    try {
      const letter = await createFutureLetter(userId, content.trim(), unlockDate);
      setLetters((prev) =>
        [...prev, letter].sort((a, b) =>
          a.unlock_date.localeCompare(b.unlock_date)
        )
      );
      setContent("");
      setUnlockDate(tomorrowStr());
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  const today = todayStr();
  const locked = letters.filter((l) => l.unlock_date > today);
  const unlocked = letters.filter((l) => l.unlock_date <= today);

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

        <h1 className="bg-gradient-to-r from-cyan-200 via-violet-300 to-fuchsia-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          Future Me
        </h1>
        <p className="mt-1 text-sm text-white/45">
          Tulis surat buat kamu di masa depan. Baru bisa dibuka pas tanggalnya tiba.
        </p>

        {loading ? (
          <div className="mt-8 h-40 animate-pulse rounded-3xl bg-white/5" />
        ) : (
          <>
            {/* FORM NULIS SURAT BARU */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dear future me..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-6 text-white placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none"
              />

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <Lock size={14} />
                  Buka pada
                  <input
                    type="date"
                    value={unlockDate}
                    min={tomorrowStr()}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-white [color-scheme:dark]"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || sending}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
                >
                  <Send size={14} />
                  {sending ? "Mengirim..." : "Kirim ke masa depan"}
                </button>
              </div>
            </div>

            {/* SURAT YANG SUDAH BISA DIBUKA */}
            {unlocked.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                  Sudah bisa dibuka
                </p>
                <div className="space-y-3">
                  {unlocked.map((letter) => (
                    <button
                      key={letter.id}
                      onClick={() => setOpenedLetter(letter)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-left transition hover:bg-cyan-500/10"
                    >
                      <Mail size={18} className="text-cyan-300" />
                      <div>
                        <p className="font-medium">
                          Surat untuk {formatDate(letter.unlock_date)}
                        </p>
                        <p className="text-xs text-white/40">Ketuk untuk baca</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SURAT YANG MASIH TERSEGEL */}
            {locked.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                  Masih tersegel
                </p>
                <div className="space-y-3">
                  {locked.map((letter) => (
                    <div
                      key={letter.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 opacity-70"
                    >
                      <Lock size={18} className="text-white/40" />
                      <div>
                        <p className="font-medium text-white/70">
                          Terbuka {formatDate(letter.unlock_date)}
                        </p>
                        <p className="text-xs text-white/35">
                          {daysUntil(letter.unlock_date)} hari lagi
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {letters.length === 0 && (
              <p className="mt-8 text-center text-sm text-white/40">
                Belum ada surat. Tulis satu buat kamu yang nanti.
              </p>
            )}
          </>
        )}
      </div>

      {/* MODAL BACA SURAT */}
      {openedLetter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
          onClick={() => setOpenedLetter(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg rounded-3xl border border-white/10 bg-[#1a1626] p-8"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
              Ditulis {formatDate(openedLetter.created_at)}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-8 text-white/85">
              {openedLetter.content}
            </p>
            <button
              onClick={() => setOpenedLetter(null)}
              className="mt-6 rounded-xl bg-white/10 px-4 py-2 text-sm transition hover:bg-white/15"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}