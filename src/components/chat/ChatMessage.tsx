// src/components/chat/ChatMessage.tsx
import { Message } from '../../types/chat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, content: string) => void;
}

export function ChatMessage({ message, onDelete, onEdit }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full p-4",
        message.sender === 'ai' ? 'bg-light-accent/50 dark:bg-dark-accent/50' : ''
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        message.sender === 'ai' ? 'bg-blue-500' : 'bg-purple-500'
      )}>
        {message.sender === 'ai' ? '🤖' : '👤'}
      </div>
      <div className="ml-4 flex-1">
        <div className="text-sm text-light-text dark:text-dark-text">
          {message.content}
        </div>
        <div className="mt-1 text-xs text-light-text/50 dark:text-dark-text/50">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}