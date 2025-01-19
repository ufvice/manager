import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { Header } from '../header';
import { Text, Stack, Button, Alert } from '@mantine/core';
import * as fs from '@tauri-apps/api/fs';
import * as shell from '@tauri-apps/api/shell';
import * as path from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { notifications } from '@mantine/notifications';
import { RUNNING_IN_TAURI, useTauriContext } from '../../tauri/TauriProvider';
import { notify } from '../../common/utils';
import { useState } from 'react';
import { resolve } from '@tauri-apps/api/path';

interface ExamplesViewProps {
  onBack: () => void;
}

export function ExamplesView({ onBack }: ExamplesViewProps) {
  const { t } = useTranslation();
  const { downloads } = useTauriContext();
  const [error, setError] = useState<string | null>(null);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  async function createFile() {
    if (!RUNNING_IN_TAURI) {
      setError('This feature is only available in the desktop app');
      return;
    }

    setIsCreatingFile(true);
    setError(null);
    setDebugInfo('');

    try {
      const filename = 'example_file.txt';
      const content = 'This is a test file from Tauri!\n' +
        'Created at: ' + new Date().toLocaleString();
      const baseDir = fs.BaseDirectory.Download;

      try {
        const exists = await fs.exists('', { dir: baseDir });
        setDebugInfo(prev => prev + `\nDownloads directory exists: ${exists}`);

        if (!exists) {
          await fs.createDir('', { dir: baseDir, recursive: true });
          setDebugInfo(prev => prev + '\nCreated downloads directory');
        }

        // Write file using BaseDirectory
        await fs.writeTextFile(filename, content, { dir: baseDir });
        setDebugInfo(prev => prev + '\nFile written successfully');

        // Get full path only when needed for Rust function
        const filePath = await resolve(filename, baseDir);
        setDebugInfo(prev => prev + `\nResolved file path: ${filePath}`);

        // Process file using Rust
        const response = await invoke('process_file', { filepath: filePath });
        setDebugInfo(prev => prev + `\nRust process response: ${response}`);

        // Open directory using BaseDirectory
        await shell.open('.', { dir: baseDir });
        setDebugInfo(prev => prev + '\nOpened directory successfully');

        notifications.show({
          title: 'Success',
          message: `File created successfully`,
          color: 'green'
        });
      } catch (e) {
        setDebugInfo(prev => prev + `\nError: ${e}`);
        throw e;
      }
    } catch (err) {
      const errorMessage = err instanceof Error
        ? `${err.name}: ${err.message}`
        : String(err);

      console.error('Failed to create file:', err);
      setError(`${errorMessage}\n\nDebug info: ${debugInfo}`);

      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red'
      });
    } finally {
      setIsCreatingFile(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-light-bg dark:bg-dark-bg">
      <Header>
        <button
          onClick={onBack}
          className="p-2 hover:bg-light-accent dark:hover:bg-dark-accent rounded-lg text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-4">
          <span className="text-sm font-medium">Examples</span>
        </div>
      </Header>

      <div className="flex-1 overflow-y-auto p-6">
        <Stack gap="lg">
          <Text size="xl" fw={600}>
            {t('Modern Desktop App Examples')}
          </Text>

          {error && (
            <Alert
              title="Error"
              color="red"
              withCloseButton
              onClose={() => setError(null)}
            >
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {error}
              </pre>
            </Alert>
          )}

          <Button
            color="blue"
            onClick={createFile}
            loading={isCreatingFile}
            disabled={isCreatingFile}
          >
            {isCreatingFile ? 'Creating File...' : 'Create Test File'}
          </Button>

          <Button
            color="green"
            onClick={() => notifications.show({
              title: 'Test Notification',
              message: 'This is a test notification'
            })}
          >
            Show Notification
          </Button>

          <Text c="dimmed" size="sm">
            These are examples of Tauri's native capabilities.
            {downloads
              ? `Files will be created in your Downloads directory: ${downloads}`
              : 'Files will be created in your home directory since Downloads is not available.'
            }
          </Text>

          {debugInfo && (
            <Alert title="Debug Info" color="blue">
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {debugInfo}
              </pre>
            </Alert>
          )}
        </Stack>
      </div>
    </div>
  );
}