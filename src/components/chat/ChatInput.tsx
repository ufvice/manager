// src/components/chat/ChatInput.tsx
import { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Search, Plus, Paperclip, Link2, Mic } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useLocalForage } from '@/common/utils';
import { Model } from '@/components/models/types';

interface ActionButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
}

function ActionButton({ icon: Icon, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-light-accent/70 dark:hover:bg-dark-accent/70 rounded text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}

export function ChatInput() {
  const [message, setMessage] = useState('');
  const { activeChatId, sendMessage } = useChatStore();
  const [selectedModel] = useLocalForage<Model | undefined>('selected-model', undefined);

  const handleSend = async () => {
    if (!activeChatId || !message.trim() || !selectedModel) return;
    await sendMessage(activeChatId, message, selectedModel);
    setMessage('');
  };

  return (
    <div className="p-4 border-t border-light-border dark:border-dark-border">
      <div className="bg-light-accent dark:bg-dark-accent rounded-lg p-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type '@' to mention an AI agent"
          className="w-full bg-transparent border-none outline-none px-2 text-light-text dark:text-dark-text placeholder:text-light-text/50 dark:placeholder:text-dark-text/50 mb-2"
        />
        <div className="flex justify-start gap-2">
          <ActionButton icon={Search} />
          <ActionButton icon={Plus} />
          <ActionButton icon={Paperclip} />
          <ActionButton icon={Link2} />
          <ActionButton icon={Mic} />
        </div>
      </div>
    </div>
  );
}