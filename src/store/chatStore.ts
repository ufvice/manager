import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Chat, ChatState, Message } from '@/types/chat';
import { apiService } from '@/services/api';
import { Model } from '@/types/model';

interface ChatStore extends ChatState {
  createChat: (modelId: string) => Promise<string>;
  deleteChat: (chatId: string) => Promise<void>;
  setActiveChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, model: Model) => Promise<void>;
  deleteMessage: (chatId: string, messageId: string) => Promise<void>;
  updateMessage: (chatId: string, messageId: string, content: string) => Promise<void>;
  starChat: (chatId: string) => void;
  retryMessage: (chatId: string, messageId: string, model: Model) => Promise<void>;
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
        console.log('Sending with model:', model);
        console.log('Model parameters:', model.parameters);

        const userMessage: Message = {
          id: `msg-${Date.now()}`,
          content,
          timestamp: Date.now(),
          sender: 'user',
          status: 'sent'
        };

        const aiMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          content: '',
          timestamp: Date.now(),
          sender: 'ai',
          status: 'sending'
        };

        set(state => ({
          chats: state.chats.map((chat: Chat) =>
            chat.id === chatId
              ? {
                ...chat,
                messages: [...chat.messages, userMessage, aiMessage],
                updatedAt: Date.now()
              }
              : chat
          )
        }));

        try {
          const chat = get().chats.find((c: Chat) => c.id === chatId);
          if (!chat) throw new Error('Chat not found');

          const updateMessageContent = (content: string) => {
            set(state => ({
              chats: state.chats.map((chat: Chat) =>
                chat.id === chatId
                  ? {
                    ...chat,
                    messages: chat.messages.map((msg: Message) =>
                      msg.id === aiMessage.id
                        ? { ...msg, content, status: msg.status === 'error' ? 'error' : 'sending' }
                        : msg
                    )
                  }
                  : chat
              )
            }));
          };

          // 确保包含了正确的上下文消息
          const contextMessages = chat.messages.slice(0, -1);

          const aiResponse = await apiService.sendChatRequest(
            model,
            contextMessages,
            updateMessageContent
          );

          // 确保最终状态更新
          set(state => ({
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? {
                  ...chat,
                  messages: chat.messages.map((msg: Message) =>
                    msg.id === aiMessage.id
                      ? { ...msg, content: aiResponse, status: 'sent' }
                      : msg
                  ),
                  updatedAt: Date.now()
                }
                : chat
            )
          }));
        } catch (error) {
          console.error('Error sending message:', error);
          set(state => ({
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? {
                  ...chat,
                  messages: chat.messages.map((msg: Message) =>
                    msg.id === aiMessage.id
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

      retryMessage: async (chatId: string, messageId: string, model: Model) => {
        const chat = get().chats.find((c: Chat) => c.id === chatId);
        if (!chat) return;

        const msgIndex = chat.messages.findIndex((m: Message) => m.id === messageId);
        if (msgIndex === -1) return;

        const contextMessages = chat.messages.slice(0, msgIndex);

        try {
          const onProgress = model.parameters.streamingEnabled ?
            (content: string) => {
              set(state => ({
                chats: state.chats.map((chat: Chat) =>
                  chat.id === chatId
                    ? {
                      ...chat,
                      messages: chat.messages.map((msg: Message, index: number) =>
                        index === msgIndex
                          ? {
                            ...msg,
                            content,
                            timestamp: Date.now(),
                            status: 'sending'
                          }
                          : msg
                      )
                    }
                    : chat
                )
              }));
            } : undefined;

          const aiResponse = await apiService.sendChatRequest(model, contextMessages, onProgress);

          set(state => ({
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? {
                  ...chat,
                  messages: chat.messages.map((msg: Message, index: number) =>
                    index === msgIndex
                      ? {
                        ...msg,
                        content: aiResponse,
                        timestamp: Date.now(),
                        status: 'sent'
                      }
                      : msg
                  ),
                  updatedAt: Date.now()
                }
                : chat
            )
          }));
        } catch (error) {
          console.error('Error retrying message:', error);
          set(state => ({
            chats: state.chats.map((chat: Chat) =>
              chat.id === chatId
                ? {
                  ...chat,
                  messages: chat.messages.map((msg: Message, index: number) =>
                    index === msgIndex
                      ? { ...msg, status: 'error' }
                      : msg
                  )
                }
                : chat
            )
          }));
        }
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);