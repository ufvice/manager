// src/types/chat.ts
export interface FileAttachment {
  id: string;
  name: string;
  content: string;
  type: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'ai';
  modelId?: string;
  status?: 'sending' | 'sent' | 'error';
  attachments?: FileAttachment[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
  isStarred?: boolean;
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  loading: boolean;
  error: string | null;
}