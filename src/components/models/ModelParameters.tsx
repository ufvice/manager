// ModelParameters.tsx
import { Model, ModelParameter } from './types';

interface ModelParametersProps {
  model: Model;
  onUpdate: (parameters: Partial<ModelParameter>) => void;
}

export function ModelParameters({ model, onUpdate }: ModelParametersProps) {
  const handleChange = (key: keyof ModelParameter, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={model.parameters.overrideGlobal}
            onChange={(e) => handleChange('overrideGlobal', e.target.checked)}
          />
          <div className={`w-11 h-6 rounded-full transition ${model.parameters.overrideGlobal ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
            <div className={`h-4 w-4 mt-1 ml-1 rounded-full bg-white transition-transform ${model.parameters.overrideGlobal ? 'transform translate-x-5' : ''
              }`} />
          </div>
        </label>
        <span>Override Global Model Parameters</span>
      </div>

      {model.parameters.overrideGlobal && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Context Limit</label>
            <select
              value={model.parameters.contextLimit}
              onChange={(e) => handleChange('contextLimit', e.target.value)}
              className="w-full p-2 rounded-lg border"
            >
              <option value="All">All Previous Messages</option>
              <option value="1">Last Message</option>
              <option value="5">Last 5 Messages</option>
              <option value="10">Last 10 Messages</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              The number of messages to include in the context for the AI assistant.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Temperature</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={model.parameters.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Higher values will make the output more random, while lower values make it more focused.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Presence Penalty</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={model.parameters.presencePenalty}
              onChange={(e) => handleChange('presencePenalty', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              How much to penalize new tokens based on whether they appear in the text so far.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frequency Penalty</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={model.parameters.frequencyPenalty}
              onChange={(e) => handleChange('frequencyPenalty', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              How much to penalize tokens based on their frequency in the text so far.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Top P</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={model.parameters.topP}
              onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              An alternative to sampling with temperature, where the model considers tokens with top_p probability mass.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Tokens</label>
            <input
              type="number"
              value={model.parameters.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              className="w-full p-2 rounded-lg border"
            />
            <p className="text-sm text-gray-500 mt-1">
              The maximum number of tokens to generate before stopping.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}