// src/components/chat/ChatMessages.tsx
import { useChatStore } from '../../store/chatStore';
import { ChatMessage } from './ChatMessage';

export function ChatMessages() {
  const { chats, activeChatId, deleteMessage, updateMessage } = useChatStore();
  const activeChat = chats.find(chat => chat.id === activeChatId);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-light-text/50 dark:text-dark-text/50">
          Select a chat or start a new one
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {activeChat.messages.map(message => (
        <ChatMessage
          key={message.id}
          message={message}
          onDelete={(messageId) => deleteMessage(activeChat.id, messageId)}
          onEdit={(messageId, content) => updateMessage(activeChat.id, messageId, content)}
        />
      ))}
    </div>
  );
}