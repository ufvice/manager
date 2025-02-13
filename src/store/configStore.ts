import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GlobalConfig {
  defaultModel?: string;
  systemInstruction: string;
  streamResponses: boolean;
}

interface ConfigState extends GlobalConfig {
  updateConfig: (config: Partial<GlobalConfig>) => void;
}

const DEFAULT_SYSTEM_INSTRUCTION = "You are a helpful AI assistant.";

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
      streamResponses: true,

      updateConfig: (config) => set((state) => ({
        ...state,
        ...config
      })),
    }),
    {
      name: 'global-config'
    }
  )
);
