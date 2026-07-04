import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getOrCreateConversation(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data: conversation } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .eq("conversation_date", today)
    .maybeSingle();

  if (conversation) return conversation;

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      conversation_date: today,
      title: "Today",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getConversations() {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      title,
      conversation_date,
      mood,
      messages (
        content
      )
    `)
    .order("conversation_date", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}

export async function updateConversationTitle(
  id: string,
  title: string
) {
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", id);

  if (error) throw error;
}

export async function updateMood(
  conversationId: string,
  mood: string
) {
  const { error } = await supabase
    .from("conversations")
    .update({
      mood,
    })
    .eq("id", conversationId);

  if (error) throw error;
}