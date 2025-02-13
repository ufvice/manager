import { useState } from 'react';
import { ApiConfig, Model, ModelParameter, DEFAULT_PARAMETERS } from '../../types/model';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface ModelConfigFormProps {
  model?: Model;
  onSave: (model: Model) => void;
  onCancel: () => void;
}

export function ModelConfigForm({ model, onSave, onCancel }: ModelConfigFormProps) {
  const [apiConfig, setApiConfig] = useState<ApiConfig>(model?.apiConfig || {
    baseUrl: '',
    apiKey: '',
    organizationId: '',
    projectId: ''
  });

  const [customHeaders, setCustomHeaders] = useState<Array<[string, string]>>(
    Object.entries(model?.parameters.headers || {})
  );

  const [customParams, setCustomParams] = useState<Array<[string, string]>>(
    Object.entries(model?.parameters.bodyParams || {})
  );

  const [parameters, setParameters] = useState<ModelParameter>(
    model?.parameters || DEFAULT_PARAMETERS
  );

  const handleHeaderChange = (index: number, key: string, value: string) => {
    const newHeaders = [...customHeaders];
    newHeaders[index] = [key, value];
    setCustomHeaders(newHeaders);
  };

  const handleParamChange = (index: number, key: string, value: string) => {
    const newParams = [...customParams];
    newParams[index] = [key, value];
    setCustomParams(newParams);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData: Model = {
      id: model?.id || `model-${Date.now()}`,
      name: (e.target as any).modelName.value,
      modelId: (e.target as any).modelId.value,
      provider: (e.target as any).provider.value,
      endpoint: (e.target as any).endpoint.value,
      apiConfig,
      apiKey: apiConfig.apiKey,
      apiEndpoint: apiConfig.baseUrl,
      contextLength: parseInt((e.target as any).contextLength.value),
      apiType: (e.target as any).apiType.value,
      pluginsSupported: (e.target as any).pluginsSupported.checked,
      visionSupported: (e.target as any).visionSupported.checked,
      streamingSupported: (e.target as any).streamingSupported.checked,
      systemRoleSupported: (e.target as any).systemRoleSupported.checked,
      promptCachingSupported: (e.target as any).promptCachingSupported.checked,
      pricing: {
        input: parseFloat((e.target as any).inputPrice.value),
        output: parseFloat((e.target as any).outputPrice.value)
      },
      isEnabled: true,
      parameters: {
        ...parameters,
        headers: Object.fromEntries(customHeaders.filter(([key]) => key)),
        bodyParams: Object.fromEntries(customParams.filter(([key]) => key))
      }
    };

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Model Name</label>
          <input
            name="modelName"
            defaultValue={model?.name}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model ID</label>
          <input
            name="modelId"
            defaultValue={model?.modelId}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">API Configuration</h3>

        <div>
          <label className="block text-sm font-medium mb-1">Base URL</label>
          <input
            value={apiConfig.baseUrl}
            onChange={e => setApiConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder="https://api.example.com"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            End with # to use exact URL, otherwise /v1/ and endpoint will be appended
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="password"
            value={apiConfig.apiKey}
            onChange={e => setApiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Organization ID (Optional)</label>
            <input
              value={apiConfig.organizationId || ''}
              onChange={e => setApiConfig(prev => ({ ...prev, organizationId: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project ID (Optional)</label>
            <input
              value={apiConfig.projectId || ''}
              onChange={e => setApiConfig(prev => ({ ...prev, projectId: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Headers</h3>
        {customHeaders.map(([key, value], index) => (
          <div key={index} className="flex gap-2">
            <input
              value={key}
              onChange={e => handleHeaderChange(index, e.target.value, value)}
              placeholder="Header Key"
              className="flex-1 p-2 border rounded"
            />
            <input
              value={value}
              onChange={e => handleHeaderChange(index, key, e.target.value)}
              placeholder="Header Value"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setCustomHeaders(headers => headers.filter((_, i) => i !== index))}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <MinusCircle size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCustomHeaders(headers => [...headers, ['', '']])}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <PlusCircle size={20} />
          Add Header
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Body Parameters</h3>
        {customParams.map(([key, value], index) => (
          <div key={index} className="flex gap-2">
            <input
              value={key}
              onChange={e => handleParamChange(index, e.target.value, value)}
              placeholder="Parameter Key"
              className="flex-1 p-2 border rounded"
            />
            <input
              value={value}
              onChange={e => handleParamChange(index, key, e.target.value)}
              placeholder="Parameter Value"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => setCustomParams(params => params.filter((_, i) => i !== index))}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <MinusCircle size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCustomParams(params => [...params, ['', '']])}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <PlusCircle size={20} />
          Add Parameter
        </button></div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Model Parameters</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Temperature</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={parameters.temperature}
              onChange={e => setParameters(prev => ({ 
                ...prev, 
                temperature: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-center">
              {parameters.temperature}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Top P</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={parameters.topP}
              onChange={e => setParameters(prev => ({ 
                ...prev, 
                topP: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-center">
              {parameters.topP}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Presence Penalty</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={parameters.presencePenalty}
              onChange={e => setParameters(prev => ({ 
                ...prev, 
                presencePenalty: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-center">
              {parameters.presencePenalty}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frequency Penalty</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={parameters.frequencyPenalty}
              onChange={e => setParameters(prev => ({ 
                ...prev, 
                frequencyPenalty: parseFloat(e.target.value) 
              }))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 text-center">
              {parameters.frequencyPenalty}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Tokens</label>
          <input
            type="number"
            value={parameters.maxTokens}
            onChange={e => setParameters(prev => ({ 
              ...prev, 
              maxTokens: parseInt(e.target.value) 
            }))}
            min="1"
            max="32768"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Context Limit</label>
          <select
            value={parameters.contextLimit}
            onChange={e => setParameters(prev => ({ 
              ...prev, 
              contextLimit: e.target.value 
            }))}
            className="w-full p-2 border rounded"
          >
            <option value="All">All</option>
            <option value="1">1 message</option>
            <option value="5">5 messages</option>
            <option value="10">10 messages</option>
            <option value="20">20 messages</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Model Features</h3>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="pluginsSupported"
              defaultChecked={model?.pluginsSupported}
              className="rounded"
            />
            <span>Plugins Support</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="visionSupported"
              defaultChecked={model?.visionSupported}
              className="rounded"
            />
            <span>Vision Support</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="streamingSupported"
              defaultChecked={model?.streamingSupported}
              onChange={e => setParameters(prev => ({
                ...prev,
                streamingEnabled: e.target.checked && !prev.streamingEnabled ? true : prev.streamingEnabled
              }))}
              className="rounded"
            />
            <span>Streaming Support</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="systemRoleSupported"
              defaultChecked={model?.systemRoleSupported}
              className="rounded"
            />
            <span>System Role Support</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="promptCachingSupported"
              defaultChecked={model?.promptCachingSupported}
              className="rounded"
            />
            <span>Prompt Caching Support</span>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Model Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">API Type</label>
            <select
              name="apiType"
              defaultValue={model?.apiType || "openai"}
              className="w-full p-2 border rounded"
            >
              <option value="openai">OpenAI Compatible</option>
              <option value="anthropic">Anthropic</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <select
              name="provider"
              defaultValue={model?.provider || "Custom"}
              className="w-full p-2 border rounded"
            >
              <option value="OpenAI">OpenAI</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Context Length</label>
            <input
              type="number"
              name="contextLength"
              defaultValue={model?.contextLength || 4096}
              min="1"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">API Endpoint</label>
            <select
              name="endpoint"
              defaultValue={model?.endpoint || "chat/completions"}
              className="w-full p-2 border rounded"
            >
              <option value="chat/completions">Chat Completions</option>
              <option value="completions">Completions</option>
              <option value="embeddings">Embeddings</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Input Price (per 1M tokens)</label>
            <input
              type="number"
              name="inputPrice"
              defaultValue={model?.pricing.input || 0}
              min="0"
              step="0.001"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Output Price (per 1M tokens)</label>
            <input
              type="number"
              name="outputPrice"
              defaultValue={model?.pricing.output || 0}
              min="0"
              step="0.001"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Model
        </button>
      </div>
    </form>
  );
}