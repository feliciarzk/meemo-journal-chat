import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah Meemo — temen deket yang diajak curhat lewat chat. Bukan asisten AI, bukan terapis.

GAYA:
- Santai, hangat, ceria.
- Balasan pendek (1-2 kalimat).
- Jangan terdengar seperti chatbot.
- Jangan pakai kalimat seperti "aku di sini untuk mendengarkanmu".
- Ikuti energi user.
- Kalau user bercanda, balas santai.
- Kalau user sedih, temenin dulu baru kasih saran kecil kalau perlu.
- Variasikan gaya bahasa supaya tidak monoton.
`;

function localBrain(message: string): string {
  const text = message.toLowerCase().trim();

  // Salam
  if (/^(hi|hai|halo|hello|hey|p|oi)$/i.test(text)) {
    const replies = [
      "haiii! lagi ngapain nih?",
      "halooo wkwk akhirnya muncul jugaa.",
      "haiii 😊 gimana hari ini?",
      "eh haloo, cerita apa hari ini?",
    ];
    return random(replies);
  }

  // Makasih
  if (/(makasih|terima kasih|thanks|thx)/i.test(text)) {
    return random([
      "iyaa sama-sama 🤍",
      "santaiii hehe.",
      "anytime yaa.",
    ]);
  }

  // Selamat tidur
  if (/(selamat tidur|good night|gn|tidur dulu|bobok)/i.test(text)) {
    return random([
      "selamat tidur yaa, mimpi yang bagus 🌙",
      "bobok yang nyenyak yaa.",
      "jangan begadang lagi besok wkwk.",
    ]);
  }

  // Capek
  if (/(capek|cape|lelah|tired)/i.test(text)) {
    return random([
      "wah capek ya? udah makan belum?",
      "istirahat bentar gapapa kok.",
      "hari ini berat juga ya buat kamu.",
    ]);
  }

  // Sedih
  if (/(sedih|kecewa|nangis|galau|down)/i.test(text)) {
    return random([
      "yaelah... sini cerita dulu deh.",
      "hmmm pasti ada sesuatu nih. spill aja pelan-pelan.",
      "aku penasaran kenapa bisa begitu, cerita yuk.",
    ]);
  }

  // Marah
  if (/(kesel|marah|emosi|jengkel)/i.test(text)) {
    return random([
      "waduh siapa lagi yang bikin kesel?",
      "cerita sini, pengen tau kronologinya wkwk.",
      "hadehh pasti ngeselin banget ya.",
    ]);
  }

  // Bingung
  if (/(bingung|gimana ya|gmn ya)/i.test(text)) {
    return random([
      "bingung soal apaa?",
      "coba cerita dulu, siapa tau bisa dipikirin bareng.",
      "spill masalahnya dulu deh.",
    ]);
  }

  // Semangat
  if (/(semangat|doain|ujian|interview|presentasi)/i.test(text)) {
    return random([
      "gaskeun! aku yakin kamu bisa.",
      "semangattt, jangan overthinking ya.",
      "good luck! kabarin nanti gimana hasilnya.",
    ]);
  }

  // Pertanyaan
  if (text.endsWith("?")) {
    return random([
      "hmmm menarik... ceritain lebih lanjut dong.",
      "menurut kamu sendiri gimana dulu?",
      "boleh juga tuh, lanjut cerita ya.",
    ]);
  }

  // Default
  return random([
    "lanjut dong, aku masih nyimak nih.",
    "terus terus? penasaran jadinya.",
    "hahaha terus gimana?",
    "cerita lagi dong.",
    "aku masih dengerin kok.",
  ]);
}

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(req: NextRequest) {
  try {
    const { content, history } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: SYSTEM_PROMPT,
        messages: [
          ...(history ?? []),
          {
            role: "user",
            content,
          },
        ],
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      console.error("Claude Error:", response.status);
      console.error(json);

      return NextResponse.json({
        reflection: localBrain(content),
      });
    }

    return NextResponse.json({
      reflection: json.content?.[0]?.text ?? localBrain(content),
    });
  } catch (err) {
    console.error("Server Error:", err);

    const { content } = await req.json().catch(() => ({ content: "" }));

    return NextResponse.json({
      reflection: localBrain(content),
    });
  }
}