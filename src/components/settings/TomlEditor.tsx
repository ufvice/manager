import { useEffect, useState } from 'react';
import { tomlService } from '@/services/tomlService';
import { Model } from '@/types/model';
import { notifications } from '@mantine/notifications';
import { Button, Textarea, Title, Group } from '@mantine/core';
import { parse, stringify } from '@ltd/j-toml';
import { Save } from 'lucide-react';

interface TomlEditorProps {
  onModelsUpdate?: (models: Model[]) => void;
}

export function TomlEditor({ onModelsUpdate }: TomlEditorProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
    const unsubscribe = tomlService.subscribe(() => {
      loadConfig();
    });
    return unsubscribe;
  }, []);

  const loadConfig = async () => {
    try {
      const config = await tomlService.readConfig();
      setContent(stringify(config));
      setError(null);
    } catch (err) {
      setError('Failed to load configuration');
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const config = parse(content);
      await tomlService.writeConfig(config);

      if (config.models && onModelsUpdate) {
        const models = Object.entries(config.models).map(([id, model]: [string, any]) => ({
          id,
          ...model
        }));
        onModelsUpdate(models as Model[]);
      }

      notifications.show({
        title: 'Success',
        message: 'Configuration saved successfully',
        color: 'green'
      });
      setError(null);
    } catch (err) {
      setError('Invalid TOML format');
      notifications.show({
        title: 'Error',
        message: 'Failed to save configuration: Invalid TOML format',
        color: 'red'
      });
    }
  };

  return (
    <div className="space-y-4">
      <Group justify="space-between">
        <Title order={3}>Configuration File</Title>
        <Button
          leftSection={<Save size={16} />}
          onClick={handleSave}
          disabled={!!error}
        >
          Save Changes
        </Button>
      </Group>

      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.currentTarget.value);
          try {
            parse(e.currentTarget.value);
            setError(null);
          } catch (err) {
            setError('Invalid TOML format');
          }
        }}
        error={error}
        minRows={20}
        styles={{ input: { fontFamily: 'monospace' } }}
        className="font-mono"
      />
    </div>
  );
}