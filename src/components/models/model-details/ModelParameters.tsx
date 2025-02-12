import { useState } from 'react';
import { Button, Select, Switch, Text } from '@mantine/core';
import { Model, ModelParameter } from '../types';

interface ModelParametersProps {
  model: Model;
  onUpdate: (params: ModelParameter) => void;
}

export function ModelParameters({ model, onUpdate }: ModelParametersProps) {
  const [parameters, setParameters] = useState<ModelParameter>(model.parameters);

  const updateParameters = (updates: Partial<ModelParameter>) => {
    const newParameters = { ...parameters, ...updates };
    setParameters(newParameters);
    onUpdate(newParameters);
  };

  return (
    <div className="space-y-6">
      <div>
        <Switch
          label="Override Global Model Parameters"
          checked={parameters.overrideGlobal}
          onChange={(e) => updateParameters({ overrideGlobal: e.currentTarget.checked })}
        />
      </div>

      {parameters.overrideGlobal && (
        <div className="space-y-4">
          <ParameterField
            label="Context Limit"
            description="The number of messages to include in the context for the AI assistant."
            value={parameters.contextLimit}
            onReset={() => updateParameters({ contextLimit: "All" })}
          >
            <Select
              data={['All', '1', '5', '10', '20']}
              value={parameters.contextLimit}
              onChange={(value) => updateParameters({ contextLimit: value || 'All' })}
              className="mt-2"
            />
          </ParameterField>

          <ParameterField
            label={`Temperature: ${parameters.temperature}`}
            description="Higher values will make the output more random, while lower values make it more focused."
            value={parameters.temperature}
            onReset={() => updateParameters({ temperature: 0.7 })}
          >
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={parameters.temperature}
              onChange={(e) => updateParameters({ temperature: parseFloat(e.target.value) })}
              className="w-full mt-2"
            />
          </ParameterField>

          <div className="space-y-2">
            <Switch
              label="Enable Streaming Response"
              description="Show AI responses word by word as they are generated"
              checked={parameters.streamingEnabled && model.streamingSupported}
              disabled={!model.streamingSupported}
              onChange={(e) => {
                console.log("Streaming enabled:", e.currentTarget.checked);
                updateParameters({ streamingEnabled: e.currentTarget.checked });
              }}
            />
            {!model.streamingSupported && (
              <Text size="xs" c="dimmed">
                This model does not support streaming responses
              </Text>
            )}
          </div>

          {/* Add other parameters similarly */}
        </div>
      )}
    </div>
  );
}

interface ParameterFieldProps {
  label: string;
  description: string;
  value: any;
  onReset: () => void;
  children: React.ReactNode;
}

function ParameterField({ label, description, children, onReset }: ParameterFieldProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
        <Button variant="subtle" size="xs" onClick={onReset}>
          Reset to default
        </Button>
      </div>
      {children}
    </div>
  );
}