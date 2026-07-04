"use client";

import ChatBubble from "./ChatBubble";

interface Message {
  id: string;
  content: string;
  role: "user" | "meemo";
  mood?: string | null;
  created_at?: string;
}

interface Props {
  messages: Message[];
  conversationId: string;
  onMoodChange?: (messageId: string, mood: string) => void;
}

export default function ChatList({
  messages,
  conversationId,
  onMoodChange,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-4">
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          id={message.id}
          content={message.content}
          role={message.role}
          mood={message.mood}
          created_at={message.created_at}
          conversationId={conversationId}
          onMoodChange={onMoodChange}
        />
      ))}
    </div>
  );
}