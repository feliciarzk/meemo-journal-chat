export interface Conversation {
  id: string;
  user_id: string;
  conversation_date: string;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  is_favorite: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}