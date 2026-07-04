"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition hover:border-red-400/40 hover:text-red-400 disabled:opacity-50"
    >
      {loading ? "Keluar..." : "Logout"}
    </button>
  );
}