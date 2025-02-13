export type ApiEndpoint = 'chat/completions' | 'completions' | 'embeddings';

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  organizationId?: string;
  projectId?: string;
}

export interface ModelParameter {
  contextLimit: string;
  temperature: number;
  presencePenalty: number;
  frequencyPenalty: number;
  topP: number;
  maxTokens: number;
  overrideGlobal: boolean;
  streamingEnabled: boolean;
  headers?: Record<string, string>;
  bodyParams?: Record<string, any>;
}

export interface Model {
  id: string;
  name: string;
  modelId: string;
  provider: string;
  endpoint: ApiEndpoint;
  apiConfig: ApiConfig;
  contextLength: number;
  apiType: string;
  apiKey: string;
  pluginsSupported: boolean;
  visionSupported: boolean;
  streamingSupported: boolean;
  systemRoleSupported: boolean;
  promptCachingSupported: boolean;
  apiEndpoint: string;
  pricing: {
    input: number;
    output: number;
  };
  isEnabled: boolean;
  parameters: ModelParameter;
}

export const DEFAULT_PARAMETERS: ModelParameter = {
  contextLimit: "All",
  temperature: 0.7,
  presencePenalty: 0,
  frequencyPenalty: 0,
  topP: 1,
  maxTokens: 2048,
  overrideGlobal: false,
  streamingEnabled: true,
  headers: {},
  bodyParams: {}
};

export const API_TYPES = ["openai", "anthropic", "custom"] as const;
export const PROVIDERS = ["OpenAI", "Custom"] as const;