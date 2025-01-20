import { Switch } from '@mantine/core';
import { Model } from '../types';
import { ProviderIcon } from './ProviderIcon';

interface ModelListItemProps {
  model: Model;
  isSelected: boolean;
  onClick: () => void;
  onToggleEnabled: (enabled: boolean) => void;
}

export function ModelListItem({ model, isSelected, onClick, onToggleEnabled }: ModelListItemProps) {
  return (
    <div
      className={`flex items-center p-3 cursor-pointer ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      onClick={onClick}
    >
      <ProviderIcon provider={model.provider} />
      <div className="ml-3 flex-1">
        <div className="text-sm font-medium">{model.name}</div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            {model.contextLength.toLocaleString()}
          </span>
        </div>
      </div>
      <Switch
        checked={model.isEnabled}
        onChange={(e) => {
          e.stopPropagation();
          onToggleEnabled(e.currentTarget.checked);
        }}
      />
    </div>
  );
}