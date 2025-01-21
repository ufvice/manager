// src/store/chatStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Chat, ChatState, Message } from '../types/chat';

interface ChatStore extends ChatState {
  // Chat Actions
  createChat: (modelId: string) => Promise<string>;
  deleteChat: (chatId: string) => Promise<void>;
  setActiveChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;

  // Message Actions
  sendMessage: (chatId: string, content: string) => Promise<void>;
  deleteMessage: (chatId: string, messageId: string) => Promise<void>;
  updateMessage: (chatId: string, messageId: string, content: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChatId: null,
      loading: false,
      error: null,

      createChat: async (modelId: string) => {
        const newChat: Chat = {
          id: `chat-${Date.now()}`,
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          modelId
        };

        set(state => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id
        }));

        return newChat.id;
      },

      deleteChat: async (chatId: string) => {
        set(state => ({
          chats: state.chats.filter(chat => chat.id !== chatId),
          activeChatId: state.activeChatId === chatId ? null : state.activeChatId
        }));
      },

      setActiveChat: (chatId: string) => {
        set({ activeChatId: chatId });
      },

      updateChatTitle: async (chatId: string, title: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, title, updatedAt: Date.now() }
              : chat
          )
        }));
      },

      sendMessage: async (chatId: string, content: string) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          content,
          timestamp: Date.now(),
          sender: 'user',
          status: 'sending'
        };

        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                updatedAt: Date.now()
              }
              : chat
          )
        }));

        // Simulate AI response
        setTimeout(() => {
          const aiMessage: Message = {
            id: `msg-${Date.now()}`,
            content: 'This is a simulated AI response.',
            timestamp: Date.now(),
            sender: 'ai',
            status: 'sent'
          };

          set(state => ({
            chats: state.chats.map(chat =>
              chat.id === chatId
                ? {
                  ...chat,
                  messages: [...chat.messages, aiMessage],
                  updatedAt: Date.now()
                }
                : chat
            )
          }));
        }, 1000);
      },

      deleteMessage: async (chatId: string, messageId: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? {
                ...chat,
                messages: chat.messages.filter(msg => msg.id !== messageId),
                updatedAt: Date.now()
              }
              : chat
          )
        }));
      },

      updateMessage: async (chatId: string, messageId: string, content: string) => {
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? {
                ...chat,
                messages: chat.messages.map(msg =>
                  msg.id === messageId
                    ? { ...msg, content, timestamp: Date.now() }
                    : msg
                ),
                updatedAt: Date.now()
              }
              : chat
          )
        }));
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);