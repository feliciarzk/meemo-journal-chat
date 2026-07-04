// lib/progress.ts
// Pure functions — gak nyentuh Supabase langsung, biar gampang dites
// dan gak peduli data asalnya dari mana.

export type MoodEmoji = "😄" | "🙂" | "😐" | "😔" | "😭";

export const MOOD_SCORES: Record<string, number> = {
  "😄": 5,
  "🙂": 4,
  "😐": 3,
  "😔": 2,
  "😭": 1,
};

export interface DayEntry {
  date: Date; // conversation_date
  mood: string | null; // conversations.mood
}

export interface DayMood {
  date: string; // "YYYY-MM-DD"
  mood: MoodEmoji | null;
}

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dominantMood(moods: string[]): MoodEmoji | null {
  if (moods.length === 0) return null;
  const count = new Map<string, number>();
  moods.forEach((m) => count.set(m, (count.get(m) ?? 0) + 1));
  let best = moods[moods.length - 1];
  let bestCount = 0;
  for (const [mood, c] of count) {
    if (c >= bestCount) {
      bestCount = c;
      best = mood;
    }
  }
  return best as MoodEmoji;
}

/**
 * Streak = hari berturut-turut ada row di `conversations` (nulis, terlepas
 * dari ada mood atau tidak). Tetap "hidup" kalau belum nulis hari ini tapi
 * kemarin nulis.
 */
export function computeStreak(entryDates: Date[]): number {
  const daySet = new Set(entryDates.map(toDateKey));
  if (daySet.size === 0) return 0;

  const today = new Date();
  const hasToday = daySet.has(toDateKey(today));

  const cursor = new Date(today);
  if (!hasToday) {
    cursor.setDate(cursor.getDate() - 1);
    if (!daySet.has(toDateKey(cursor))) return 0;
  }

  let streak = 0;
  while (daySet.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * 7 hari terakhir (rolling, termasuk hari ini), mood langsung diambil dari
 * conversations.mood hari itu — gak perlu agregasi lagi karena satu
 * conversation = satu hari.
 */
export function computeWeeklyMood(entries: DayEntry[]): DayMood[] {
  const byDay = new Map<string, string | null>();
  entries.forEach((e) => byDay.set(toDateKey(e.date), e.mood));

  const result: DayMood[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - 6);

  for (let i = 0; i < 7; i++) {
    const key = toDateKey(cursor);
    const mood = byDay.get(key) ?? null;
    result.push({ date: key, mood: mood as MoodEmoji | null });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

export interface GrowthStats {
  totalEntries30d: number;
  topMood: MoodEmoji | null;
  trend: "naik" | "stabil" | "turun" | "belum-cukup-data";
  insightMessage: string;
}

const INSIGHT_TEMPLATES = {
  naik: [
    (streak: number) =>
      `Mood kamu cenderung membaik minggu ini. Streak ${streak} hari — jalan terus ya.`,
    (streak: number) =>
      `Ada progres yang kelihatan di mood kamu minggu ini. ${streak} hari berturut-turut, mantap.`,
  ],
  stabil: [
    () => `Mood kamu cukup stabil minggu ini. Konsistensi itu juga bentuk kemajuan.`,
    () => `Gak banyak gejolak minggu ini — kadang tenang itu udah cukup baik.`,
  ],
  turun: [
    () => `Kelihatannya minggu ini agak berat. Gapapa, nulis di sini aja udah langkah bagus.`,
    () => `Mood kamu turun dari minggu lalu. Pelan-pelan aja, gak perlu buru-buru baikan.`,
  ],
  "belum-cukup-data": [
    () => `Masih terlalu sedikit data buat lihat pola. Coba cerita lagi beberapa hari ke depan.`,
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function computeGrowthStats(
  entries: DayEntry[],
  streak: number
): GrowthStats {
  const totalEntries30d = entries.length;

  const allMoods = entries.map((e) => e.mood).filter((m): m is string => Boolean(m));
  const topMood = dominantMood(allMoods);

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const scoreOf = (e: DayEntry) => (e.mood ? MOOD_SCORES[e.mood] ?? 3 : null);

  const thisWeekScores = entries
    .filter((e) => e.date >= weekAgo)
    .map(scoreOf)
    .filter((s): s is number => s !== null);
  const lastWeekScores = entries
    .filter((e) => e.date >= twoWeeksAgo && e.date < weekAgo)
    .map(scoreOf)
    .filter((s): s is number => s !== null);

  let trend: GrowthStats["trend"] = "belum-cukup-data";
  if (thisWeekScores.length >= 3 && lastWeekScores.length >= 3) {
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const diff = avg(thisWeekScores) - avg(lastWeekScores);
    if (diff > 0.3) trend = "naik";
    else if (diff < -0.3) trend = "turun";
    else trend = "stabil";
  }

  const templates = INSIGHT_TEMPLATES[trend];
  const insightMessage = pick(templates)(streak);

  return { totalEntries30d, topMood, trend, insightMessage };
}