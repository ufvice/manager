import { Model } from '../types';

interface ModelOverviewProps {
  model: Model;
}

export function ModelOverview({ model }: ModelOverviewProps) {
  const details = [
    { label: 'Model ID', value: model.modelId },
    { label: 'Provider', value: model.provider },
    { label: 'Context Length', value: model.contextLength.toLocaleString() },
    { label: 'API Type', value: model.apiType },
    { label: 'Plugins supported', value: model.pluginsSupported ? 'Yes' : 'No' },
    { label: 'Vision supported', value: model.visionSupported ? 'Yes' : 'No' },
    { label: 'Streaming output supported', value: model.streamingSupported ? 'Yes' : 'No' },
    { label: 'System role supported', value: model.systemRoleSupported ? 'Yes' : 'No' },
    { label: 'Prompt caching supported', value: model.promptCachingSupported ? 'Yes' : 'No' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <div className="text-sm text-gray-500">{label}</div>
            <div>{value}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-sm text-gray-500">API Endpoint</div>
        <div className="break-all">{model.apiEndpoint}</div>
      </div>

      <div>
        <div className="text-sm text-gray-500">Price for Cost Estimation</div>
        <div>${model.pricing.input.toFixed(2)} / 1M input tokens</div>
        <div>${model.pricing.output.toFixed(2)} / 1M output tokens</div>
      </div>
    </div>
  );
}