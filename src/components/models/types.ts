// types.ts
export interface ModelParameter {
  contextLimit: string;
  temperature: number;
  presencePenalty: number;
  frequencyPenalty: number;
  topP: number;
  maxTokens: number;
  overrideGlobal: boolean;
}

export interface Model {
  id: string;
  name: string;
  modelId: string;
  provider: string;
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
  overrideGlobal: false
};

export const API_TYPES = ["openai", "anthropic", "google", "custom"] as const;
export const PROVIDERS = ["All", "Custom", "Google", "OpenAI", "Anthropic"] as const;