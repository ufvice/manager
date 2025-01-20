// src/components/models/ModelOverview.tsx
import { Model } from './types';

interface ModelOverviewProps {
  model: Model;
}

export function ModelOverview({ model }: ModelOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Model ID</h3>
          <p>{model.modelId}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Provider</h3>
          <p>{model.provider}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Context Length</h3>
          <p>{model.contextLength.toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">API Type</h3>
          <p>{model.apiType}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Features</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${model.pluginsSupported ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Plugins support</span>
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${model.visionSupported ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Vision support</span>
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${model.streamingSupported ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Streaming support</span>
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${model.systemRoleSupported ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>System role support</span>
            </div>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${model.promptCachingSupported ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Prompt caching support</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">API Endpoint</h3>
          <p className="break-all">{model.apiEndpoint}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Pricing</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm text-gray-500">Input tokens</p>
            <p>${model.pricing.input.toFixed(3)} / 1M tokens</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Output tokens</p>
            <p>${model.pricing.output.toFixed(3)} / 1M tokens</p>
          </div>
        </div>
      </div>
    </div>
  );
}