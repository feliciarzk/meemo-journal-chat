import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at");

  if (error) throw error;
  return data;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  mood: string | null
) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    content,
    role: "user",
    mood,
  });
  if (error) throw error;

  const { data: recent } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(10);

  const history = (recent ?? [])
    .reverse()
    .map((m) => ({
      role: m.role === "meemo" ? "assistant" : "user",
      content: m.content,
    }));

  const res = await fetch("/api/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, history }),
  });
  const { reflection } = await res.json();

  const { data: reply, error: replyError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      content: reflection,
      role: "meemo",
    })
    .select()
    .single();

  if (replyError) throw replyError;
  return reply;
}

export async function updateMessageMood(messageId: string, mood: string) {
  const { error } = await supabase
    .from("messages")
    .update({ mood })
    .eq("id", messageId);

  if (error) throw error;
}