// src/types/chat.ts
export interface Message {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'ai';
  modelId?: string;
  status?: 'sending' | 'sent' | 'error';
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  loading: boolean;
  error: string | null;
}