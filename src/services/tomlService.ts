import { parse, stringify } from '@ltd/j-toml';
import { readTextFile, writeTextFile, BaseDirectory, exists } from '@tauri-apps/api/fs';
import { Model } from '@/types/model';

const CONFIG_FILE = 'config.toml';

// 最小化的默认配置
const DEFAULT_CONFIG = {
  models: {} as Record<string, unknown>
};

export class TomlService {
  private listeners: Array<(config: any) => void> = [];
  private lastContent: string = '';
  private checkInterval: number | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const fileExists = await exists(CONFIG_FILE, { dir: BaseDirectory.App });
      if (!fileExists) {
        // 尝试先验证 TOML 字符串是否有效
        const tomlString = stringify(DEFAULT_CONFIG, { newline: '\n' });
        console.log('Generated TOML:', tomlString); // 调试输出

        // 尝试解析生成的 TOML 以验证其有效性
        parse(tomlString);

        // 如果解析成功，则写入文件
        await writeTextFile(CONFIG_FILE, tomlString, { dir: BaseDirectory.App });
        this.lastContent = tomlString;
        console.log('Config file created successfully');
      }
      this.setupAutoCheck();
    } catch (error) {
      console.error('Failed to initialize config:', error);
      // 输出更详细的错误信息
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  private setupAutoCheck() {
    this.checkInterval = window.setInterval(async () => {
      try {
        const content = await readTextFile(CONFIG_FILE, { dir: BaseDirectory.App });
        if (content !== this.lastContent) {
          // 在解析之前打印内容以检查
          console.log('Reading file content:', content);

          const config = parse(content);
          this.lastContent = content;
          this.notifyListeners(config);
        }
      } catch (error) {
        console.error('Failed to check config file:', error);
      }
    }, 5000);
  }

  async readConfig(): Promise<any> {
    try {
      const content = await readTextFile(CONFIG_FILE, { dir: BaseDirectory.App });
      console.log('Reading config content:', content); // 调试输出
      return parse(content);
    } catch (error) {
      console.warn('Error reading config file:', error);
      return { ...DEFAULT_CONFIG };
    }
  }

  async writeConfig(config: any): Promise<void> {
    try {
      const safeConfig = {
        models: config.models || {}
      };

      // 打印要写入的配置对象
      console.log('Writing config object:', safeConfig);

      const tomlString = stringify(safeConfig, { newline: '\n' });

      // 打印生成的 TOML 字符串
      console.log('Generated TOML string:', tomlString);

      // 尝试解析生成的 TOML 以验证其有效性
      parse(tomlString);

      await writeTextFile(CONFIG_FILE, tomlString, { dir: BaseDirectory.App });
      this.lastContent = tomlString;
    } catch (error) {
      console.error('Failed to write config:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  async updateModels(models: Model[]): Promise<void> {
    try {
      const modelMap = models.reduce((acc, model) => {
        // 确保所有数值类型字段都是数字
        acc[model.id] = {
          name: String(model.name || ''),
          modelId: String(model.modelId || ''),
          provider: String(model.provider || ''),
          contextLength: Math.max(1, Math.floor(Number(model.contextLength) || 4096)),
          apiType: String(model.apiType || ''),
          isEnabled: Boolean(model.isEnabled)
        };
        return acc;
      }, {} as Record<string, any>);

      console.log('Updating models with:', modelMap); // 调试输出
      await this.writeConfig({ models: modelMap });
    } catch (error) {
      console.error('Failed to update models:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  }

  async getModels(): Promise<Partial<Model>[]> {
    const config = await this.readConfig();
    if (!config.models) return [];

    return Object.entries(config.models).map(([id, model]: [string, any]) => ({
      id,
      ...model
    }));
  }

  subscribe(listener: (config: any) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(config: any): void {
    this.listeners.forEach(listener => listener(config));
  }

  destroy(): void {
    if (this.checkInterval !== null) {
      window.clearInterval(this.checkInterval);
    }
  }
}

export const tomlService = new TomlService();