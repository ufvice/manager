import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from "../header";
import { MessageInput } from "../chat/message-input";
import { MainArea } from "./main-area";
import ModelSelector from './model-selector';
import { Model } from '@/components/models/types';
import { useLocalForage } from '@/common/utils';

interface MainContentProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function MainContent({ isSidebarCollapsed, onToggleSidebar }: MainContentProps) {
  const [selectedModel, setSelectedModel] = useLocalForage<Model | undefined>('selected-model', undefined);

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
      <MainArea />
      <MessageInput />
    </div>
  );
}