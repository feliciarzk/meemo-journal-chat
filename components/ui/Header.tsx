"use client";

import { Bell, Search } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface HeaderProps {
  name?: string;
}

export default function Header({
  name = "Feli",
}: HeaderProps) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 17
      ? "Good Afternoon 🌤️"
      : hour < 20
      ? "Good Evening 🌙"
      : "Good Night 🌌";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#171321]/80 backdrop-blur-2xl">

      <div className="flex items-center justify-between px-8 py-6">

        <div>

          <p className="text-sm text-white/45">
            {greeting}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Welcome back,
            <span className="bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
              {" "}
              {name}
            </span>
          </h1>

          <p className="mt-2 text-white/40">
            Let's continue today's conversation.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 transition hover:bg-white/10">
            <Search size={20} />
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 transition hover:bg-white/10">
            <Bell size={20} />
          </button>

          <LogoutButton />

        </div>

      </div>

    </header>
  );
}