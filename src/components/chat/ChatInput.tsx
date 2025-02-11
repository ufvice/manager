import { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Search, Plus, Paperclip, Link2, Mic, Send, ChevronDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useLocalForage } from '@/common/utils';
import { Model } from '@/components/models/types';
import { Popover } from '@mantine/core';

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
  const [enterToSend, setEnterToSend] = useLocalForage<boolean>('enter-to-send', true);
  const [showPopover, setShowPopover] = useState(false);

  const handleSend = async () => {
    if (!activeChatId || !message.trim() || !selectedModel) return;
    await sendMessage(activeChatId, message, selectedModel);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        handleSend();
      } else if (enterToSend && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      } else if (!enterToSend && e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className="p-4 border-t border-light-border dark:border-dark-border">
      <div className="rounded-lg p-2" style={{ background: 'var(--color-sidebar)' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type '@' to mention an AI agent"
          className="w-full text-light-text dark:text-dark-text placeholder:text-light-text/50 dark:placeholder:text-dark-text/50 mb-2 resize-none min-h-[40px] max-h-[200px] px-2 focus:outline-none focus:ring-0 selection:bg-blue-500/30 overflow-y-auto appearance-none"
          style={{ 
            background: 'var(--color-sidebar)',
            WebkitAppearance: 'none'
          }}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            const newHeight = Math.min(target.scrollHeight, 200);
            target.style.height = newHeight + 'px';
          }}
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <ActionButton icon={Search} />
            <ActionButton icon={Plus} />
            <ActionButton icon={Paperclip} />
            <ActionButton icon={Link2} />
            <ActionButton icon={Mic} />
          </div>
          <div className="flex items-center">
            <Popover 
              opened={showPopover}
              onChange={setShowPopover}
              position="top"
              offset={5}
              width={200}
            >
              <Popover.Target>
                <button 
                  className="p-1 hover:bg-light-accent/70 dark:hover:bg-dark-accent/70 rounded"
                  onClick={() => setShowPopover(!showPopover)}
                >
                  <ChevronDown className="w-4 h-4 text-light-text/50 dark:text-dark-text/50" />
                </button>
              </Popover.Target>
              <Popover.Dropdown>
                <div className="flex items-center justify-between p-2">
                  <span className="text-sm">Enter to send</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enterToSend}
                      onChange={(e) => setEnterToSend(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="text-xs text-light-text/50 dark:text-dark-text/50 px-2 pb-2">
                  {enterToSend ? (
                    <>
                      Press Enter to send<br />
                      Press Shift + Enter for new line
                    </>
                  ) : (
                    <>
                      Press Shift + Enter to send<br />
                      Press Enter for new line
                    </>
                  )}
                </div>
              </Popover.Dropdown>
            </Popover>
            <button
              onClick={handleSend}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-2 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}