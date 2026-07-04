// app/api/progress/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computeStreak, computeWeeklyMood, computeGrowthStats, DayEntry } from "@/lib/progress";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = since.toISOString().split("T")[0];

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("conversation_date, mood")
    .eq("user_id", user.id)
    .gte("conversation_date", sinceStr)
    .order("conversation_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const entries: DayEntry[] = (conversations ?? []).map((c) => ({
    date: new Date(c.conversation_date),
    mood: c.mood ?? null,
  }));

  const streak = computeStreak(entries.map((e) => e.date));
  const weeklyMood = computeWeeklyMood(entries);
  const growth = computeGrowthStats(entries, streak);

  return NextResponse.json({ streak, weeklyMood, growth });
}