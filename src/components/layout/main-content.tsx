// src/components/layout/main-content.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from "../header";
import { MainArea } from "./main-area";
import ModelSelector from './model-selector';
import { Model } from '@/components/models/types';
import { useLocalForage } from '@/common/utils';
import { ChatMessages } from '../chat/ChatMessages';
import { ChatInput } from '../chat/ChatInput';
import { useChatStore } from '../../store/chatStore';

interface MainContentProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function MainContent({ isSidebarCollapsed, onToggleSidebar }: MainContentProps) {
  const [selectedModel, setSelectedModel] = useLocalForage<Model | undefined>('selected-model', undefined);
  const { activeChatId } = useChatStore();

  return (
    <div className="flex-1 flex flex-col">
      <Header>
        <button
          className="p-2 hover:bg-light-accent dark:hover:bg-dark-accent rounded-lg text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text"
          onClick={onToggleSidebar}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
        <div className="ml-4 flex items-center gap-2">
          <ModelSelector
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
          />
        </div>
      </Header>

      {activeChatId ? (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      ) : (
        <MainArea /> // 当没有选中对话时显示主区域
      )}
    </div>
  );
}