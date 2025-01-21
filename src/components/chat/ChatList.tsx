// src/components/chat/ChatList.tsx
import { useChatStore } from '../../store/chatStore';

export function ChatList() {
  const { chats, activeChatId, setActiveChat, deleteChat } = useChatStore();

  return (
    <div className="py-2">
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`flex items-center p-4 hover:bg-light-accent dark:hover:bg-dark-accent cursor-pointer ${activeChatId === chat.id ? 'bg-light-accent dark:bg-dark-accent' : ''
            }`}
          onClick={() => setActiveChat(chat.id)}
        >
          <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
          <div className="ml-3 flex-grow overflow-hidden">
            <div className="text-sm text-light-text dark:text-dark-text">
              {chat.title}
            </div>
            <div className="text-xs text-light-text/70 dark:text-dark-text/70 truncate">
              {chat.messages[chat.messages.length - 1]?.content || 'No messages'}
            </div>
          </div>
          <div className="text-xs text-light-text/50 dark:text-dark-text/50 ml-2">
            {new Date(chat.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}