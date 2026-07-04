"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const email = new FormData(e.currentTarget).get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-white/70">
          Kalau email kamu terdaftar, link reset udah kita kirim. Cek inbox
          (atau folder spam) ya.
        </p>
        <a href="/login" className="text-xs text-[#A79FE8] hover:underline">
          Kembali ke halaman masuk
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-white/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="kamu@email.com"
          className="rounded-xl border border-white/10 bg-[#13111C] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#7C74E8] focus:outline-none focus:ring-1 focus:ring-[#7C74E8]"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-xl bg-[#7C74E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8f87f2] disabled:opacity-60"
      >
        {loading ? "Mengirim..." : "Kirim link reset"}
      </button>

      <a href="/login" className="text-center text-xs text-[#A79FE8] hover:underline">
        Batal, kembali ke masuk
      </a>
    </form>
  );
}