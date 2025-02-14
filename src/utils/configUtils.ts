import { AppConfig } from '@/types/config';

export const DEFAULT_CONFIG: AppConfig = {
  keyboard: {
    'new-chat': {
      id: 'new-chat',
      label: 'New Chat',
      key: 'n',
      ctrl: true,
      category: 'system',
      action: (e) => {
        e.preventDefault();
        // Action will be bound in the component
      }
    },
    'toggle-sidebar': {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      key: 'b',
      ctrl: true,
      category: 'navigation',
      action: (e) => {
        e.preventDefault();
        // Action will be bound in the component
      }
    },
    'send-message': {
      id: 'send-message',
      label: 'Send Message',
      key: 'Enter',
      category: 'editor',
      action: (e) => {
        e.preventDefault();
        // Action will be bound in the component
      }
    }
  },
  theme: {
    id: 'theme',
    label: 'Theme',
    colorScheme: 'system',
    primaryColor: '#3b82f6',
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI Variable Text, Segoe UI, Roboto, Helvetica',
    spacing: 16,
    borderRadius: 8,
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
    }
  },
  models: {
    id: 'models',
    label: 'Models',
    defaultModel: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: 'You are a helpful AI assistant.',
    streamResponse: true
  },
  general: {
    id: 'general',
    label: 'General',
    language: 'en',
    autoSave: true,
    notifications: true,
    telemetry: false
  }
};

export function mergeConfig(base: AppConfig, override: Partial<AppConfig>): AppConfig {
  return {
    keyboard: { ...base.keyboard, ...override.keyboard },
    theme: { ...base.theme, ...override.theme },
    models: { ...base.models, ...override.models },
    general: { ...base.general, ...override.general }
  };
}