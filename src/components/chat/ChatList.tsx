// src/components/chat/ChatList.tsx
import { useState } from 'react';
import { Star, Trash2, MoreVertical } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { Chat } from '../../types/chat';

export function ChatList() {
  const { chats, activeChatId, setActiveChat, deleteChat, starChat, updateChatTitle } = useChatStore();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleTitleClick = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleTitleSave = (chatId: string) => {
    if (editTitle.trim() !== '') {
      updateChatTitle(chatId, editTitle.trim());
    }
    setEditingChatId(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return `${Math.floor(diffDays / 30)}月前`;
  };

  return (
    <div className="py-2">
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`relative flex items-start p-4 hover:bg-light-accent/40 dark:hover:bg-dark-accent/40 cursor-pointer h-[72px] ${activeChatId === chat.id ? 'bg-light-accent/40 dark:bg-dark-accent/40' : ''
            }`}
          onClick={() => setActiveChat(chat.id)}
          onMouseEnter={() => setHoveredChatId(chat.id)}
          onMouseLeave={() => setHoveredChatId(null)}
        >
          <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
          <div className="ml-3 flex-grow min-w-0 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleTitleSave(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave(chat.id);
                    if (e.key === 'Escape') setEditingChatId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm bg-transparent border border-light-accent dark:border-dark-accent rounded px-2 py-1 w-full focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <div
                  className="text-sm text-light-text dark:text-dark-text relative group truncate pr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTitleClick(chat);
                  }}
                >
                  <span className="group-hover:bg-light-accent/50 dark:group-hover:bg-dark-accent/50 px-2 py-1 rounded">
                    {chat.title}
                  </span>
                </div>
              )}

              <div className={`flex items-center gap-1 transition-opacity duration-200 ${hoveredChatId === chat.id ? 'opacity-100' : 'opacity-0'
                }`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    starChat(chat.id);
                  }}
                  className={`p-1 rounded-full hover:bg-light-accent dark:hover:bg-dark-accent ${chat.isStarred ? 'text-yellow-500' : 'text-light-text/50 dark:text-dark-text/50'
                    }`}
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="p-1 rounded-full hover:bg-light-accent dark:hover:bg-dark-accent text-light-text/50 dark:text-dark-text/50"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-full hover:bg-light-accent dark:hover:bg-dark-accent text-light-text/50 dark:text-dark-text/50"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div className="text-sm text-light-text/70 dark:text-dark-text/70 truncate flex-grow pr-4">
                {chat.messages[chat.messages.length - 1]?.content || 'No messages'}
              </div>
              <div className="text-xs text-light-text/50 dark:text-dark-text/50 flex-shrink-0">
                {formatDate(chat.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}