"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateConversation } from "@/lib/services/conversation";
import { getMessages, sendMessage } from "@/lib/services/message";

import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import Sidebar from "@/components/ui/Sidebar";
import LogoutButton from "@/components/ui/LogoutButton";

interface Message {
  id: string;
  content: string;
  role: "user" | "meemo";
  mood?: string | null;
  created_at?: string;
}

interface Conversation {
  id: string;
  conversation_date: string;
  title: string | null;
  preview?: string;
  mood?: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [todayConversationId, setTodayConversationId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // room hari ini otomatis kebuat/keambil, ini yang bikin tombol
        // "Start Today's Conversation" gak diperlukan lagi
        const conversation = await getOrCreateConversation(user.id);

        setTodayConversationId(conversation.id);
        setActiveConversationId(conversation.id);

        const data = await getMessages(conversation.id);
        setMessages(data ?? []);

        const { data: convs } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", user.id)
          .order("conversation_date", { ascending: false });

        setConversations(convs ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Dipanggil pas user klik salah satu histori chat di sidebar
  async function handleSelectConversation(id: string) {
    if (id === activeConversationId) return;

    setActiveConversationId(id);
    setLoadingMessages(true);

    try {
      const data = await getMessages(id);
      setMessages(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSend(content: string, mood: string | null) {
    if (!activeConversationId) return;

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content,
        role: "user",
        mood,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const reply = await sendMessage(activeConversationId, content, mood);

      if (reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: reply.id,
            content: reply.content,
            role: "meemo",
            created_at: reply.created_at,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleMoodChange(messageId: string, mood: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, mood } : m))
    );

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId ? { ...c, mood } : c
      )
    );
  }

  const isViewingToday = activeConversationId === todayConversationId;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#13111C] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#171321] via-[#14111D] to-[#13111C] text-white">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className="flex flex-1 flex-col">
        <header className="border-b border-white/10 bg-[#171321]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-8 py-5">
            <div>
              <h1 className="text-2xl font-bold">
                {isViewingToday ? "Today's Journal" : "Journal"}
              </h1>

              <p className="mt-1 text-sm text-white/40">
                {isViewingToday
                  ? "Everything you write stays with you."
                  : "Looking back at a previous entry."}
              </p>
            </div>

            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-8 py-8">
            {loadingMessages ? (
              <div className="flex h-[70vh] items-center justify-center text-white/40">
                Loading conversation...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-[70vh] items-center justify-center">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <Sparkles size={28} />
                  </div>

                  <h2 className="text-xl font-semibold">
                    Welcome to Meemo
                  </h2>

                  <p className="mt-3 max-w-md text-white/45">
                    Start writing whatever is on your mind.
                  </p>
                </div>
              </div>
            ) : (
              <ChatList
                messages={messages}
                conversationId={activeConversationId!}
                onMoodChange={handleMoodChange}
              />
            )}

            <div ref={bottomRef} />
          </div>
        </main>

        {/* Input cuma buat nulis di hari ini — hari-hari lalu read-only */}
        {isViewingToday && (
          <footer className="border-t border-white/10 bg-[#171321]/80 p-5 backdrop-blur-xl">
            <div className="mx-auto max-w-5xl">
              <ChatInput onSend={handleSend} />
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}