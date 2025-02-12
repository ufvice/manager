import { useState } from 'react';
import { Button, Group, Title, Text, TextInput, SegmentedControl, Tabs } from '@mantine/core';
import { Plus, Settings, Search, Check, Trash2, Copy, Edit } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { Model, ModelParameter } from '@/components/models/types';
import { useLocalForage } from '@/common/utils';
import { ProviderIcon } from '@/components/models/model-list/ProviderIcon';
import { ModelListItem } from '@/components/models/model-list/ModelListItem';
import { ModelOverview } from '@/components/models/model-details/ModelOverview';
import { ModelParameters } from '@/components/models/model-details/ModelParameters';
import { GlobalSettings } from '@/components/models/global-settings/GlobalSettings';
import { ModelEditForm } from '@/components/models/ModelEditForm';

export function ModelsView() {
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocalModel, setSelectedLocalModel] = useLocalForage<Model | undefined>('selected-model', undefined);

  const [modelsData, setModelsData] = useLocalForage<{ data: { models: Model[] } }>('models-data', {
    data: { models: [] }
  });

  const handleSaveModel = (model: Model) => {
    const updatedModels = selectedModel
      ? modelsData.data.models.map(m => m.id === model.id ? model : m)
      : [...modelsData.data.models, model];

    setModelsData({
      data: {
        models: updatedModels
      }
    });

    notifications.show({
      title: selectedModel ? 'Model Updated' : 'Model Added',
      message: `Successfully ${selectedModel ? 'updated' : 'added'} model ${model.name}`,
      color: 'green',
    });

    setIsEditing(false);
    setSelectedModel(model);
  };

  const handleToggleModelEnabled = (model: Model, enabled: boolean) => {
    const updatedModels = modelsData.data.models.map(m =>
      m.id === model.id ? { ...m, isEnabled: enabled } : m
    );
    setModelsData({ data: { models: updatedModels } });
  };

  const handleDuplicate = (model: Model) => {
    const newModel = {
      ...model,
      id: `model-${Date.now()}`,
      name: `${model.name} (Copy)`,
    };
    setSelectedModel(newModel);
    setIsEditing(true);
  };

  const handleDelete = (model: Model) => {
    const updatedModels = modelsData.data.models.filter(m => m.id !== model.id);
    setModelsData({
      data: {
        models: updatedModels
      }
    });

    notifications.show({
      title: 'Model Deleted',
      message: `Successfully deleted model ${model.name}`,
      color: 'red',
    });

    setSelectedModel(null);
  };

  const handleSetDefault = (model: Model) => {
    // Here you would implement the logic to set this model as default
    notifications.show({
      title: 'Default Model Set',
      message: `${model.name} is now the default model`,
      color: 'green',
    });
  };

  const handleParameterUpdate = (model: Model, params: ModelParameter) => {
    console.log('Before update - models:', modelsData.data.models);

    const updatedModel = {
      ...model,
      parameters: { ...params }
    };

    const updatedModels = modelsData.data.models.map(m =>
      m.id === model.id ? updatedModel : m
    );

    console.log('After update - updated model:', updatedModel);

    setModelsData({
      data: {
        models: updatedModels
      }
    });

    if (selectedLocalModel?.id === model.id) {
      setSelectedLocalModel(updatedModel);
    }

    notifications.show({
      title: 'Parameters Updated',
      message: `Successfully updated parameters for ${model.name}`,
      color: 'green',
    });
  };

  const filteredModels = modelsData.data.models.filter(model => {
    if (selectedProvider !== 'All' && model.provider !== selectedProvider) return false;
    if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (isEditing) {
    return (
      <div className="p-6">
        <Title order={2} className="mb-6">{selectedModel ? 'Edit Model' : 'Add New Model'}</Title>
        <ModelEditForm
          model={selectedModel || undefined}
          onSave={handleSaveModel}
          onCancel={() => {
            setIsEditing(false);
            if (!selectedModel?.id) {
              setSelectedModel(null);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left Sidebar */}
      <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button
            leftSection={<Settings size={16} />}
            variant="light"
            fullWidth
            onClick={() => setShowGlobalSettings(true)}
          >
            Global Settings
          </Button>

          <Button
            leftSection={<Plus size={16} />}
            variant="filled"
            color="blue"
            fullWidth
            className="mt-4"
            onClick={() => {
              setSelectedModel(null);
              setIsEditing(true);
            }}
          >
            Add Custom Model
          </Button>

          <TextInput
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search size={16} />}
            className="mt-4"
          />

          <SegmentedControl
            data={[
              { label: 'All', value: 'All' },
              { label: 'Custom', value: 'Custom' },
              { label: 'Google', value: 'Google' },
              { label: 'OpenAI', value: 'OpenAI' },
              { label: 'Anthropic', value: 'Anthropic' },
            ]}
            value={selectedProvider}
            onChange={setSelectedProvider}
            fullWidth
            className="mt-4"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredModels.map((model) => (
            <ModelListItem
              key={model.id}
              model={model}
              isSelected={selectedModel?.id === model.id}
              onClick={() => {
                setSelectedModel(model);
                setShowGlobalSettings(false);
              }}
              onToggleEnabled={(enabled) => handleToggleModelEnabled(model, enabled)}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {showGlobalSettings ? (
          <div>
            <Title order={2} className="mb-6">Global Settings</Title>
            <GlobalSettings />
          </div>
        ) : selectedModel ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ProviderIcon provider={selectedModel.provider} />
                <Title order={2} className="ml-3">{selectedModel.name}</Title>
              </div>
              <Group>
                <Button
                  variant="light"
                  color="green"
                  leftSection={<Check size={16} />}
                  onClick={() => handleSetDefault(selectedModel)}
                >
                  Set Default
                </Button>
                <Button
                  variant="light"
                  color="red"
                  leftSection={<Trash2 size={16} />}
                  onClick={() => handleDelete(selectedModel)}
                >
                  Delete
                </Button>
                <Button
                  variant="light"
                  leftSection={<Copy size={16} />}
                  onClick={() => handleDuplicate(selectedModel)}
                >
                  Duplicate
                </Button>
                <Button
                  variant="light"
                  leftSection={<Edit size={16} />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </Group>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="parameters">Parameters</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <ModelOverview model={selectedModel} />
              </Tabs.Panel>

              <Tabs.Panel value="parameters" pt="md">
                <ModelParameters
                  model={selectedModel}
                  onUpdate={(params) => handleParameterUpdate(selectedModel, params)}
                />
              </Tabs.Panel>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <Text c="dimmed">Select a model from the list or add a new one</Text>
          </div>
        )}
      </div>
    </div>
  );
}