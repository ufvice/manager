import { AppConfig, ConfigCategory, ConfigItem, ConfigValueType } from '@/types/config';
import { DEFAULT_CONFIG } from '@/utils/configUtils';
import localforage from 'localforage';

const CONFIG_KEY = 'app_config';

export class ConfigService {
  private listeners: Array<(category: ConfigCategory, key: string, value: ConfigValueType) => void> = [];

  async getConfig(): Promise<AppConfig> {
    const storedConfig = await localforage.getItem<Partial<AppConfig>>(CONFIG_KEY);
    return {
      keyboard: { ...DEFAULT_CONFIG.keyboard, ...storedConfig?.keyboard },
      theme: { ...DEFAULT_CONFIG.theme, ...storedConfig?.theme },
      models: { ...DEFAULT_CONFIG.models, ...storedConfig?.models },
      general: { ...DEFAULT_CONFIG.general, ...storedConfig?.general }
    };
  }

  async setConfig(category: ConfigCategory, key: string, value: ConfigValueType): Promise<void> {
    const currentConfig = await this.getConfig();
    const updatedConfig = {
      ...currentConfig,
      [category]: {
        ...currentConfig[category],
        [key]: value
      }
    };

    await localforage.setItem(CONFIG_KEY, updatedConfig);
    this.notifyListeners(category, key, value);
  }

  async validateConfig(config: ConfigItem, value: ConfigValueType): Promise<string[]> {
    const errors: string[] = [];

    if (!config.validation) return errors;

    for (const rule of config.validation) {
      switch (rule.type) {
        case 'required':
          if (value === null || value === undefined || value === '') {
            errors.push(rule.message);
          }
          break;
        case 'min':
          if (typeof value === 'number' && rule.value && value < (rule.value as number)) {
            errors.push(rule.message);
          }
          break;
        case 'max':
          if (typeof value === 'number' && rule.value && value > (rule.value as number)) {
            errors.push(rule.message);
          }
          break;
        case 'pattern':
          if (typeof value === 'string' && rule.value && !(rule.value as RegExp).test(value)) {
            errors.push(rule.message);
          }
          break;
        case 'custom':
          if (rule.validator && !rule.validator(value)) {
            errors.push(rule.message);
          }
          break;
      }
    }

    return errors;
  }

  async exportConfig(): Promise<string> {
    const config = await this.getConfig();
    return JSON.stringify(config, null, 2);
  }

  async importConfig(configStr: string): Promise<void> {
    try {
      const config = JSON.parse(configStr);
      await localforage.setItem(CONFIG_KEY, config);

      // 通知每个配置项的变化
      for (const [category, values] of Object.entries(config)) {
        if (typeof values === 'object') {
          for (const [key, value] of Object.entries(values)) {
            this.notifyListeners(category as ConfigCategory, key, value);
          }
        }
      }
    } catch (error) {
      throw new Error('Invalid configuration format');
    }
  }

  subscribe(listener: (category: ConfigCategory, key: string, value: ConfigValueType) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(category: ConfigCategory, key: string, value: ConfigValueType): void {
    this.listeners.forEach(listener => listener(category, key, value));
  }
}

export const configService = new ConfigService();