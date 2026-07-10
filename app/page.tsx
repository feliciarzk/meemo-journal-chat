"use client";

import Link from "next/link";
import Image from "next/image";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

type Msg = { from: "me" | "meemo"; text: string };

const conversation: Msg[] = [
  { from: "me", text: "capek. banyak banget pikiran hari ini." },
  { from: "meemo", text: "gapapa. tulis aja semuanya, gak ada yang nge-judge di sini." },
  { from: "me", text: "kayaknya aku mulai kewalahan sama kerjaan." },
  { from: "meemo", text: "ini topik yang sama kayak 3 hari lalu. mungkin saatnya istirahat?" },
];

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function ChatMock() {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion.current) {
      setVisible(conversation.length);
      return;
    }

    let cancelled = false;

    async function run() {
      let step = 0;
      while (!cancelled) {
        setTyping(true);
        await wait(900);
        if (cancelled) return;
        setTyping(false);
        step += 1;
        setVisible(step);
        await wait(1400);
        if (step >= conversation.length) {
          await wait(1800);
          if (cancelled) return;
          step = 0;
          setVisible(0);
          await wait(500);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm rounded-[22px] border border-white/10 bg-[#1D1A2B] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] sm:rounded-[28px] sm:p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="h-2 w-2 rounded-full bg-[#7C74E8]" />
        <span className="font-[family-name:var(--font-body)] text-xs tracking-wide text-white/50">
          jurnal privat kamu
        </span>
      </div>

      <div className="flex min-h-[220px] flex-col justify-end gap-3 sm:min-h-[280px]">
        {conversation.slice(0, visible).map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed animate-[fadeUp_0.4s_ease] ${
              m.from === "me"
                ? "self-end rounded-br-sm bg-[#F6F1E7] text-[#1D1A2B]"
                : "self-start rounded-bl-sm bg-[#2A2640] text-[#D8D3EE]"
            }`}
          >
            {m.text}
          </div>
        ))}

        {typing && (
          <div className="flex w-fit items-center gap-1 self-start rounded-2xl rounded-bl-sm bg-[#2A2640] px-4 py-3">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8B87A0] [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8B87A0] [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#8B87A0]" />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} min-h-screen bg-[#13111C] font-[family-name:var(--font-body)] text-white`}
    >
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-5 py-10 sm:gap-16 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:gap-12">
        {/* left column */}
        <div className="flex flex-1 flex-col gap-5 sm:gap-6 lg:max-w-md">
          <span className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 font-[family-name:var(--font-body)] text-xs tracking-wide text-[#A79FE8]">
            curhat, tapi sama diri sendiri
          </span>

          <p className="font-[family-name:var(--font-display)] text-xl leading-snug text-white/90 sm:text-2xl lg:text-3xl">
            Nulis bebas.
            <br />
            Refleksi jujur.
          </p>

          <p className="max-w-sm text-sm leading-relaxed text-white/50 sm:text-[15px]">
            Ruang buat ngeluarin semua isi kepala kayak lagi chatan — tanpa
            takut dihakimi, tanpa harus rapi. Meemo bantu kamu liat pola dari
            cerita-cerita kamu sendiri.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-[#7C74E8] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#8f87f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C74E8]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white/90 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            >
              Daftar
            </Link>
          </div>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-white/10 pt-5 text-[13px] text-white/45 sm:mt-6 sm:pt-6">
            <p>Privat — cuma kamu yang bisa baca</p>
            <p>Kapan aja, sekalipun jam 2 pagi</p>
            <p>Meemo bantu liat pola dari waktu ke waktu</p>
          </div>
        </div>

        {/* right column: chat mockup */}
        <div className="flex flex-1 justify-center lg:justify-end">
          <ChatMock />
        </div>
      </div>
    </main>
  );
}