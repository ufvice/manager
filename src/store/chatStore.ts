import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Chat, ChatState, Message } from '../types/chat';
import { sendChatMessage } from '../services/chat';
import { Model } from '../components/models/types';

interface ChatStore extends ChatState {
  createChat: (modelId: string) => Promise<string>;
  deleteChat: (chatId: string) => Promise<void>;
  setActiveChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, model: Model) => Promise<void>;
  deleteMessage: (chatId: string, messageId: string) => Promise<void>;
  updateMessage: (chatId: string, messageId: string, content: string) => Promise<void>;
  starChat: (chatId: string) => void;
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
          chats: state.chats.filter((chat: Chat) => chat.id !== chatId),
          activeChatId: state.activeChatId === chatId ? null : state.activeChatId
        }));
      },

      setActiveChat: (chatId: string) => {
        set({ activeChatId: chatId });
      },

      updateChatTitle: async (chatId: string, title: string) => {
        set(state => ({
          chats: state.chats.map((chat: Chat) =>
            chat.id === chatId
              ? { ...chat, title, updatedAt: Date.now() }
              : chat
          )
        }));
      },

      sendMessage: async (chatId: string, content: string, model: Model) => {
        const userMessage: Message = {
          id: `msg-${Date.now()}`,
          content,
          timestamp: Date.now(),
          sender: 'user',
          status: 'sending'
        };

        // Add user message to chat
        set(state => ({
          chats: state.chats.map((chat: Chat) =>
            chat.id === chatId
              ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                updatedAt: Date.now()
              }
              : chat
          )
        }));

        try {
          // Get current chat messages
          const chat = get().chats.find((c: Chat) => c.id === chatId);
          if (!chat) throw new Error('Chat not found');

          // Send message to AI service
          const aiResponse = await sendChatMessage(model, [...chat.messages, userMessage]);

          // Add AI response to chat
          const aiMessage: Message = {
            id: `msg-${Date.now()}`,
            content: aiResponse,
            timestamp: Date.now(),
            sender: 'ai',
            status: 'sent'
          };

          set(state => ({
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? {
                  ...chat,
                  messages: [...chat.messages, aiMessage],
                  updatedAt: Date.now()
                }
                : chat
            )
          }));
        } catch (error) {
          console.error('Error sending message:', error);
          // Update user message status to error
          set(state => ({
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? {
                  ...chat,
                  messages: chat.messages.map((msg: Message) =>
                    msg.id === userMessage.id
                      ? { ...msg, status: 'error' }
                      : msg
                  )
                }
                : chat
            )
          }));
        }
      },

      deleteMessage: async (chatId: string, messageId: string) => {
        set(state => ({
          chats: state.chats.map((chat: Chat) =>
            chat.id === chatId
              ? {
                ...chat,
                messages: chat.messages.filter((msg: Message) => msg.id !== messageId),
                updatedAt: Date.now()
              }
              : chat
          )
        }));
      },

      updateMessage: async (chatId: string, messageId: string, content: string) => {
        set(state => ({
          chats: state.chats.map((chat: Chat) =>
            chat.id === chatId
              ? {
                ...chat,
                messages: chat.messages.map((msg: Message) =>
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

      starChat: (chatId: string) => {
        set(state => ({
          chats: state.chats.map((chat: Chat) =>
            chat.id === chatId
              ? { ...chat, isStarred: !chat.isStarred }
              : chat
          ).sort((a: Chat, b: Chat) => {
            if (a.isStarred === b.isStarred) {
              return b.updatedAt - a.updatedAt;
            }
            return a.isStarred ? -1 : 1;
          })
        }));
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);