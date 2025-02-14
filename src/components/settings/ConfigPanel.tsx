import { useState, useEffect } from 'react';
import { Tabs, TextInput, Switch, NumberInput, ColorInput, Select, Button, Stack, Title, Group, Paper } from '@mantine/core';
import { configService } from '@/services/configService';
import { AppConfig, ConfigCategory } from '@/types/config';
import { notifications } from '@mantine/notifications';
import { Upload, Download, Save, X } from 'lucide-react';
import { TomlEditor } from './TomlEditor';
import { Model } from '@/types/model';

export function ConfigPanel() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [activeTab, setActiveTab] = useState<ConfigCategory>('general');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await configService.getConfig();
    setConfig(config);
  };

  const handleConfigChange = async (category: ConfigCategory, key: string, value: any) => {
    if (!config) return;

    setConfig(prev => prev ? {
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    } : null);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      for (const [category, values] of Object.entries(config)) {
        for (const [key, value] of Object.entries(values)) {
          await configService.setConfig(category as ConfigCategory, key, value);
        }
      }
      setIsDirty(false);
      notifications.show({
        title: 'Success',
        message: 'Configuration saved successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save configuration',
        color: 'red'
      });
    }
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const configStr = await file.text();
        await configService.importConfig(configStr);
        await loadConfig();
        notifications.show({
          title: 'Success',
          message: 'Configuration imported successfully',
          color: 'green'
        });
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to import configuration',
          color: 'red'
        });
      }
    };
    input.click();
  };

  const handleExport = async () => {
    const configStr = await configService.exportConfig();
    const blob = new Blob([configStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleModelsUpdate = (models: Model[]) => {
    setModelsData({ data: { models } });
  };

  if (!config) return null;

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-light-bg dark:bg-dark-bg">
      <div className="mb-6">
        <Group justify="space-between" align="center">
          <Title order={2}>Settings</Title>
          <Group>
            <Button
              variant="light"
              leftSection={<Upload size={16} />}
              onClick={handleImport}
            >
              Import
            </Button>
            <Button
              variant="light"
              leftSection={<Download size={16} />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              color="red"
              variant="light"
              leftSection={<X size={16} />}
              onClick={() => loadConfig()}
              disabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              variant="filled"
              leftSection={<Save size={16} />}
              onClick={handleSave}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </Group>
        </Group>
      </div>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as ConfigCategory)}>
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="appearance">Appearance</Tabs.Tab>
          <Tabs.Tab value="keyboard">Keyboard</Tabs.Tab>
          <Tabs.Tab value="models">Models</Tabs.Tab>
          <Tabs.Tab value="config">Configuration</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="xl">
          <Stack gap="md">
            <Switch
              label="Enable notifications"
              checked={config.general.notifications}
              onChange={(e) => handleConfigChange('general', 'notifications', e.currentTarget.checked)}
            />
            <Switch
              label="Enable telemetry"
              checked={config.general.telemetry}
              onChange={(e) => handleConfigChange('general', 'telemetry', e.currentTarget.checked)}
            />
            <Select
              label="Language"
              value={config.general.language}
              onChange={(value) => handleConfigChange('general', 'language', value)}
              data={[
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'French' }
              ]}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="appearance" pt="xl">
          <Stack gap="md">
            <Select
              label="Color scheme"
              value={config.theme.colorScheme}
              onChange={(value) => handleConfigChange('theme', 'colorScheme', value)}
              data={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' }
              ]}
            />
            <ColorInput
              label="Primary color"
              value={config.theme.primaryColor}
              onChange={(value) => handleConfigChange('theme', 'primaryColor', value)}
            />
            <NumberInput
              label="Font size"
              value={config.theme.fontSize}
              onChange={(value) => handleConfigChange('theme', 'fontSize', value)}
              min={12}
              max={24}
            />
            <TextInput
              label="Font family"
              value={config.theme.fontFamily}
              onChange={(e) => handleConfigChange('theme', 'fontFamily', e.currentTarget.value)}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="keyboard" pt="xl">
          <Stack gap="md">
            {Object.entries(config.keyboard).map(([key, shortcut]) => (
              <Group key={key} align="end">
                <TextInput
                  label={shortcut.label}
                  value={shortcut.key}
                  onChange={(e) => handleConfigChange('keyboard', key, {
                    ...shortcut,
                    key: e.currentTarget.value
                  })}
                />
                <Switch
                  label="Ctrl"
                  checked={shortcut.ctrl}
                  onChange={(e) => handleConfigChange('keyboard', key, {
                    ...shortcut,
                    ctrl: e.currentTarget.checked
                  })}
                />
                <Switch
                  label="Alt"
                  checked={shortcut.alt}
                  onChange={(e) => handleConfigChange('keyboard', key, {
                    ...shortcut,
                    alt: e.currentTarget.checked
                  })}
                />
                <Switch
                  label="Shift"
                  checked={shortcut.shift}
                  onChange={(e) => handleConfigChange('keyboard', key, {
                    ...shortcut,
                    shift: e.currentTarget.checked
                  })}
                />
              </Group>
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="models" pt="xl">
          <Stack gap="md">
            <Select
              label="Default model"
              value={config.models.defaultModel}
              onChange={(value) => handleConfigChange('models', 'defaultModel', value)}
              data={[
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
              ]}
            />
            <NumberInput
              label="Temperature"
              value={config.models.temperature}
              onChange={(value) => handleConfigChange('models', 'temperature', value)}
              min={0}
              max={2}
              step={0.1}
            />
            <NumberInput
              label="Max tokens"
              value={config.models.maxTokens}
              onChange={(value) => handleConfigChange('models', 'maxTokens', value)}
              min={1}
              max={32000}
            />
            <TextInput
              label="System prompt"
              value={config.models.systemPrompt}
              onChange={(e) => handleConfigChange('models', 'systemPrompt', e.currentTarget.value)}
            />
            <Switch
              label="Stream responses"
              checked={config.models.streamResponse}
              onChange={(e) => handleConfigChange('models', 'streamResponse', e.currentTarget.checked)}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="config" pt="xl">
          <Paper p="md">
            <TomlEditor onModelsUpdate={handleModelsUpdate} />
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}