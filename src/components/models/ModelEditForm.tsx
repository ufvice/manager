// ModelEditForm.tsx
import { useState } from 'react';
import { API_TYPES, DEFAULT_PARAMETERS, PROVIDERS, type Model } from '@/types/model';

interface ModelEditFormProps {
  model?: Model;
  onSave: (model: Model) => void;
  onCancel: () => void;
}

export function ModelEditForm({ model, onSave, onCancel }: ModelEditFormProps) {
  const [formData, setFormData] = useState<Partial<Model>>(model || {
    id: `model-${Date.now()}`,
    name: '',
    modelId: '',
    provider: 'Custom',
    contextLength: 4096,
    apiType: 'openai',
    apiKey: '',
    pluginsSupported: false,
    visionSupported: false,
    streamingSupported: true,
    systemRoleSupported: true,
    promptCachingSupported: false,
    apiEndpoint: '',
    pricing: {
      input: 0,
      output: 0
    },
    isEnabled: false,
    parameters: { ...DEFAULT_PARAMETERS }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Model);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 rounded-lg border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model ID</label>
          <input
            type="text"
            value={formData.modelId}
            onChange={e => setFormData(prev => ({ ...prev, modelId: e.target.value }))}
            className="w-full p-2 rounded-lg border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Provider</label>
          <select
            value={formData.provider}
            onChange={e => setFormData(prev => ({ ...prev, provider: e.target.value }))}
            className="w-full p-2 rounded-lg border"
          >
            {PROVIDERS.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Type</label>
          <select
            value={formData.apiType}
            onChange={e => setFormData(prev => ({ ...prev, apiType: e.target.value }))}
            className="w-full p-2 rounded-lg border"
          >
            {API_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={e => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
            className="w-full p-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Context Length</label>
          <input
            type="number"
            value={formData.contextLength}
            onChange={e => setFormData(prev => ({ ...prev, contextLength: parseInt(e.target.value) }))}
            className="w-full p-2 rounded-lg border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Endpoint</label>
          <input
            type="url"
            value={formData.apiEndpoint}
            onChange={e => setFormData(prev => ({ ...prev, apiEndpoint: e.target.value }))}
            className="w-full p-2 rounded-lg border"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Input Price (per 1M tokens)</label>
            <input
              type="number"
              value={formData.pricing?.input}
              onChange={e => setFormData(prev => ({
                ...prev,
                pricing: { input: parseFloat(e.target.value), output: prev.pricing?.output ?? 0 }
              }))}
              step="0.01"
              className="w-full p-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Output Price (per 1M tokens)</label>
            <input
              type="number"
              value={formData.pricing?.output}
              onChange={e => setFormData(prev => ({
                ...prev,
                pricing: { input: prev.pricing?.input ?? 0, output: parseFloat(e.target.value) }
              }))}
              step="0.01"
              className="w-full p-2 rounded-lg border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.pluginsSupported}
              onChange={e => setFormData(prev => ({ ...prev, pluginsSupported: e.target.checked }))}
            />
            <span>Plugins Supported</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.visionSupported}
              onChange={e => setFormData(prev => ({ ...prev, visionSupported: e.target.checked }))}
            />
            <span>Vision Supported</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.streamingSupported}
              onChange={e => setFormData(prev => ({ ...prev, streamingSupported: e.target.checked }))}
            />
            <span>Streaming Supported</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.systemRoleSupported}
              onChange={e => setFormData(prev => ({ ...prev, systemRoleSupported: e.target.checked }))}
            />
            <span>System Role Supported</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.promptCachingSupported}
              onChange={e => setFormData(prev => ({ ...prev, promptCachingSupported: e.target.checked }))}
            />
            <span>Prompt Caching Supported</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}