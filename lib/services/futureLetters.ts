import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface FutureLetter {
  id: string;
  content: string;
  unlock_date: string;
  created_at: string;
}

export async function createFutureLetter(
  userId: string,
  content: string,
  unlockDate: string
) {
  const { data, error } = await supabase
    .from("future_letters")
    .insert({ user_id: userId, content, unlock_date: unlockDate })
    .select()
    .single();

  if (error) throw error;
  return data as FutureLetter;
}

export async function getFutureLetters(
  userId: string
): Promise<FutureLetter[]> {
  const { data, error } = await supabase
    .from("future_letters")
    .select("*")
    .eq("user_id", userId)
    .order("unlock_date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}