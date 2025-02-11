import { useState } from 'react';
import { Message } from '../../types/chat';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Copy, Trash2, Edit2, Check, RefreshCw, MessageSquare } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string, content: string) => void;
  onRetry?: (messageId: string) => void;
}

export function ChatMessage({ message, onDelete, onEdit, onRetry }: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleDelete = () => {
    onDelete(message.id);
  };

  const handleEditConfirm = () => {
    onEdit(message.id, editContent);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

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
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[100px] p-2 bg-light-accent dark:bg-dark-accent rounded-lg resize-y"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditConfirm}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check size={16} />
                Confirm
              </button>
              <button
                onClick={handleEditCancel}
                className="px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-light-text dark:text-dark-text prose-sm">
              <MarkdownRenderer content={message.content} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-xs text-light-text/50 dark:text-dark-text/50">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1 text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text rounded"
                  title="Copy message"
                >
                  <Copy size={14} />
                </button>
                {message.sender === 'ai' && onRetry && (
                  <button
                    onClick={() => onRetry(message.id)}
                    className="p-1 text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text rounded"
                    title="Retry with current model"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text rounded"
                  title="Edit message"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-light-text/50 dark:text-dark-text/50 hover:text-red-500 rounded"
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}