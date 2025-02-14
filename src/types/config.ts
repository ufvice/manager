import { KeyboardEvent } from 'react';

// 基础配置接口
export interface BaseConfig {
  id: string;
  label: string;
  description?: string;
}

// 所有配置的分类
export type ConfigCategory = 'models' | 'keyboard' | 'appearance' | 'general';

// 配置项的值类型
export type ConfigValueType =
  | string
  | number
  | boolean
  | string[]
  | Record<string, unknown>
  | null;

// 配置项验证规则
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  message: string;
  value?: number | string | RegExp;
  validator?: (value: ConfigValueType) => boolean;
}

// 快捷键配置
export interface KeyboardShortcut extends BaseConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  category: 'editor' | 'navigation' | 'system';
  action: (event: KeyboardEvent) => void;
}

// UI主题配置
export interface ThemeConfig extends BaseConfig {
  colorScheme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: number;
  fontFamily: string;
  spacing: number;
  borderRadius: number;
  shadows: Record<string, string>;
}

// 模型配置
export interface ModelConfig extends BaseConfig {
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  streamResponse: boolean;
}

// 通用设置
export interface GeneralConfig extends BaseConfig {
  language: string;
  autoSave: boolean;
  notifications: boolean;
  telemetry: boolean;
}

// 配置项定义
export interface ConfigItem<T extends ConfigValueType = ConfigValueType> extends BaseConfig {
  category: ConfigCategory;
  type: 'string' | 'number' | 'boolean' | 'select' | 'multiSelect' | 'color' | 'object';
  defaultValue: T;
  value?: T;
  options?: Array<{
    label: string;
    value: T;
  }>;
  validation?: ValidationRule[];
  onChange?: (value: T) => void;
}

// 完整配置对象
export interface AppConfig {
  keyboard: Record<string, KeyboardShortcut>;
  theme: ThemeConfig;
  models: ModelConfig;
  general: GeneralConfig;
}