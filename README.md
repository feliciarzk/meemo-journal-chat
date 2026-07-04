# Meemo — Your Safe Place to Talk

> A chat-style journaling application where every conversation becomes a personal journal.
Meemo transforms traditional journaling into a natural conversation. Instead of staring at a blank page, users chat with **Meemo**, an AI companion that feels like a close friend. Every day's conversation is automatically saved as a journal entry, allowing users to reflect on their emotions over time.

---

## Live Demo
https://meemo-journal-chat-a0p8xqmg2-feliciarzks-projects.vercel.app/

---

## Features
Chat-Based Journaling
- Journal naturally through conversation.
- One chat room is automatically created every day.
- Previous conversations become read-only journals.

Mood Reactions
- React to every message with emotions.
- Multiple moods can exist in one day.
- Supports:
  - 😄 Happy
  - 🙂 Calm
  - 😐 Neutral
  - 😔 Sad
  - 😭 Very Sad

Journal History
- Browse previous conversations from the sidebar.
- Continue today's journal anytime.
- View old conversations without modifying them.

Growth Insight
Analyze emotional patterns over time.
Displays:
- Total journal entries
- Dominant mood
- Weekly mood timeline
- 30-day emotional trend

Future Me
Write letters to your future self.
- Choose an unlock date
- Letters remain locked until the selected day
- Read them when the time arrives

AI Companion
Powered by Claude (Anthropic API).
Meemo is designed to:
- feel like texting a close friend
- avoid robotic therapist-style responses
- match the user's energy
- keep replies short and natural

---

# Tech Stack
| Category | Technology |
|----------|------------|
| Framework | Next.js 16 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| AI | Anthropic Claude |
| Icons | Lucide React |

---

# Project Structure
```
meemo
│
├── app
│   ├── api
│   │   ├── progress
│   │   └── reflect
│   ├── chat
│   ├── growth
│   ├── future-me
│   ├── login
│   ├── register
│   └── forgot-password
│
├── components
│   ├── chat
│   ├── auth
│   └── ui
│
├── lib
│   ├── services
│   ├── supabase
│   └── progress.ts
│
└── types
```

---

## Preview

<img width="1517" height="782" alt="image" src="https://github.com/user-attachments/assets/bbf05395-88da-4a1c-b02e-f1765ae2e09b" />


## 👩‍💻 Author

**Felicia Rizka Putri**
Built as a personal project to explore AI-assisted journaling with Next.js, Supabase, and Anthropic Claude.
