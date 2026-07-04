"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (type === "register") {
      const name = formData.get("name") as string;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {type === "register" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-white/60">
            Nama
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Nama kamu"
            className="rounded-xl border border-white/10 bg-[#13111C] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#7C74E8] focus:outline-none focus:ring-1 focus:ring-[#7C74E8]"
          />
        </div>
      )}

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

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-medium text-white/60">
            Kata sandi
          </label>
          {type === "login" && (
            <a href="/forgot-password" className="text-xs text-[#A79FE8] hover:underline">
              Lupa kata sandi?
            </a>
          )}
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Minimal 8 karakter"
          className="rounded-xl border border-white/10 bg-[#13111C] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#7C74E8] focus:outline-none focus:ring-1 focus:ring-[#7C74E8]"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-xl bg-[#7C74E8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8f87f2] disabled:opacity-60"
      >
        {loading ? "Memproses..." : type === "register" ? "Daftar" : "Masuk"}
      </button>

      <p className="mt-1 text-center text-xs text-white/40">
        {type === "register" ? (
          <>
            Sudah punya akun?{" "}
            <a href="/login" className="text-[#A79FE8] hover:underline">
              Masuk di sini
            </a>
          </>
        ) : (
          <>
            Belum punya akun?{" "}
            <a href="/register" className="text-[#A79FE8] hover:underline">
              Daftar sekarang
            </a>
          </>
        )}
      </p>
    </form>
  );
}