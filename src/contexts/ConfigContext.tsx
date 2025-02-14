import { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react';
import { AppConfig, ConfigCategory } from '@/types/config';
import { configService } from '@/services/configService';
import { DEFAULT_CONFIG, mergeConfig } from '@/utils/configUtils';

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (category: ConfigCategory, key: string, value: any) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    loadConfig();
    const unsubscribe = configService.subscribe((category, key, value) => {
      setConfig(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));
    });

    return () => unsubscribe();
  }, []);

  const loadConfig = async () => {
    const savedConfig = await configService.getConfig();
    setConfig(mergeConfig(DEFAULT_CONFIG, savedConfig));
  };

  const updateConfig = async (category: ConfigCategory, key: string, value: any) => {
    await configService.setConfig(category, key, value);
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}