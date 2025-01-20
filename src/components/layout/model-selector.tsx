import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Model } from '@/components/models/types';
import { useLocalForage } from '@/common/utils';

interface ModelSelectorProps {
  selectedModel?: Model;
  onModelSelect: (model: Model) => void;
}

export default function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modelsData] = useLocalForage<{ data: { models: Model[] } }>('models-data', { data: { models: [] } });
  const models = modelsData?.data?.models || [];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-light-accent dark:bg-dark-accent rounded-lg hover:bg-light-accent/70 dark:hover:bg-dark-accent/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          {selectedModel?.provider === 'Anthropic' && (
            <img
              src="https://storage.googleapis.com/typingmind/anthropic.png"
              alt="Anthropic"
              className="w-4 h-4"
            />
          )}
          <span>{selectedModel?.name || 'Select a model'}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-72 mt-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg shadow-lg">
          <div className="p-2 max-h-[300px] overflow-y-auto">
            {models.map((model) => (
              <button
                key={model.id}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent ${selectedModel?.id === model.id ? 'bg-light-accent dark:bg-dark-accent' : ''
                  }`}
                onClick={() => {
                  onModelSelect(model);
                  setIsOpen(false);
                }}
              >
                {model.provider === 'Anthropic' && (
                  <img
                    src="https://storage.googleapis.com/typingmind/anthropic.png"
                    alt="Anthropic"
                    className="w-4 h-4"
                  />
                )}
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{model.name}</div>
                  <div className="text-xs text-light-text/70 dark:text-dark-text/70">
                    Context: {model.contextLength.toLocaleString()} tokens
                  </div>
                </div>
                {model.isEnabled && (
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}