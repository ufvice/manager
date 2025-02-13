// src/components/layout/main-content.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Header } from "../header";
import { MainArea } from "./main-area";
import ModelSelector from './model-selector';
import { Model } from '@/types/model';
import { useLocalForage } from '@/common/utils';
import { ChatMessages } from '../chat/ChatMessages';
import { ChatInput } from '../chat/ChatInput';
import { useChatStore } from '../../store/chatStore';
import { useCallback } from 'react';

interface MainContentProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function MainContent({ isSidebarCollapsed, onToggleSidebar }: MainContentProps) {
  const [selectedModel, setSelectedModel] = useLocalForage<Model | undefined>('selected-model', undefined);
  const [modelsData] = useLocalForage<{ data: { models: Model[] } }>('models-data', { data: { models: [] } });
  const { activeChatId } = useChatStore();
  const location = useLocation();
  const isChat = location.pathname === "/";

  const getLatestModel = useCallback(() => {
    if (!selectedModel) return undefined;
    const latest = modelsData.data.models.find(m => m.id === selectedModel.id);
    console.log('Latest model data:', latest);
    return latest;
  }, [selectedModel, modelsData]);

  const handleModelSelect = (model: Model) => {
    console.log('Setting selected model:', model);
    setSelectedModel(model);
  };

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
        {isChat && <div className="ml-4 flex items-center gap-2">
          <ModelSelector
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
          />
        </div>}
      </Header>

      {isChat && activeChatId ? (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      ) : (
        <MainArea />
      )}
    </div>
  );
}