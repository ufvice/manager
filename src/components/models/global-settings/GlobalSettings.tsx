import { Select, Switch, Textarea } from '@mantine/core';
import { useLocalForage } from '@/common/utils';
import { Model } from '@/types/model';
import { useConfigStore } from '@/store/configStore';

export function GlobalSettings() {
  const [modelsData] = useLocalForage<{ data: { models: Model[] } }>('models-data', {
    data: { models: [] }
  });
  const { systemInstruction, streamResponses, defaultModel, updateConfig } = useConfigStore();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium mb-2">Default Model</div>
        <Select
          value={defaultModel}
          onChange={(value: string | null) => updateConfig({ defaultModel: value || undefined })}
          data={modelsData.data.models
            .filter(model => model.isEnabled)
            .map(model => ({
              value: model.id,
              label: model.name
            }))}
        />
      </div>

      <div>
        <div className="text-sm font-medium mb-2">System Instruction</div>
        <Textarea
          value={systemInstruction}
          onChange={(e) => updateConfig({ systemInstruction: e.currentTarget.value })}
          minRows={3}
          placeholder="Enter system instruction for AI"
        />
      </div>

      <Switch
        label="Stream AI responses word by word"
        checked={streamResponses}
        onChange={(e) => updateConfig({ streamResponses: e.currentTarget.checked })}
      />
    </div>
  );
}