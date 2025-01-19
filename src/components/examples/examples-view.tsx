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
      // 获取目标目录路径
      let targetDir: string;
      let baseDir: fs.BaseDirectory;

      if (downloads) {
        targetDir = downloads;
        baseDir = fs.BaseDirectory.Download;
        setDebugInfo(prev => prev + `\nFound downloads dir: ${downloads}`);

        // 检查下载目录是否存在
        try {
          const exists = await fs.exists('', { dir: fs.BaseDirectory.Download });
          setDebugInfo(prev => prev + `\nDownloads directory exists: ${exists}`);

          if (!exists) {
            setDebugInfo(prev => prev + '\nTrying to create downloads directory...');
            await fs.createDir('', {
              dir: fs.BaseDirectory.Download,
              recursive: true
            });
          }
        } catch (e) {
          setDebugInfo(prev => prev + `\nError checking/creating downloads dir: ${e}`);
          throw e;
        }
      } else {
        // 使用用户主目录
        targetDir = await path.homeDir();
        baseDir = fs.BaseDirectory.Home;
        setDebugInfo(prev => prev + `\nUsing home directory: ${targetDir}`);
      }

      // 创建文件
      const filename = 'example_file.txt';
      setDebugInfo(prev => prev + `\nAttempting to create file: ${filename}`);

      const content = 'This is a test file from Tauri!\n' +
        'Created at: ' + new Date().toLocaleString();

      try {
        await fs.writeTextFile(filename, content, { dir: baseDir });
        setDebugInfo(prev => prev + '\nFile written successfully');
      } catch (e) {
        setDebugInfo(prev => prev + `\nError writing file: ${e}`);
        throw e;
      }

      const filePath = `${targetDir}${filename}`;
      setDebugInfo(prev => prev + `\nFull file path: ${filePath}`);

      // 调用 Rust 后端处理文件
      try {
        const response = await invoke('process_file', { filepath: filePath });
        setDebugInfo(prev => prev + `\nRust process response: ${response}`);
      } catch (e) {
        setDebugInfo(prev => prev + `\nError from Rust process: ${e}`);
        throw e;
      }

      // 尝试打开目录
      try {
        await shell.open(targetDir);
        setDebugInfo(prev => prev + '\nOpened directory successfully');
      } catch (e) {
        setDebugInfo(prev => prev + `\nError opening directory: ${e}`);
        // 不抛出错误，因为文件已经创建成功
        console.warn('Failed to open directory:', e);
      }

      notifications.show({
        title: 'Success',
        message: `File created at: ${filePath}`,
        color: 'green'
      });

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
    <div className="flex-1 flex flex-col h-full">
      <Header>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
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