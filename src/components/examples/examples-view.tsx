import { Text, Button, TextInput, Stack, Title, Group, Anchor } from '@mantine/core';
import { Trans, useTranslation } from 'react-i18next';
import * as fs from '@tauri-apps/api/fs';
import * as shell from '@tauri-apps/api/shell';
import { invoke } from '@tauri-apps/api/tauri';
import { notifications } from '@mantine/notifications';
import { appWindow } from '@tauri-apps/api/window';
import { APP_NAME, RUNNING_IN_TAURI, useMinWidth, useTauriContext } from '../../tauri/TauriProvider';
import { createStorage } from '../../tauri/storage';
import { notify } from '../../common/utils';

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamplesViewProps {
  onBack: () => void;
}

function toggleFullscreen() {
  appWindow.isFullscreen().then(x => appWindow.setFullscreen(!x));
}

export function ExamplesView({ onBack }: ExamplesViewProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
    onBack();
  };
  const { t } = useTranslation();
  const { fileSep, documents, downloads } = useTauriContext();

  // Add console.log for debugging
  console.log('ExamplesView rendering', { fileSep, documents, downloads });

  const storeName = `${documents}${APP_NAME}${fileSep}example_view.dat`;
  const { use: useKVP, loading } = createStorage(storeName);
  const [exampleData, setExampleData] = useKVP('exampleKey', '');

  useMinWidth(1000);

  async function createFile() {
    if (RUNNING_IN_TAURI) {
      const filePath = `${downloads}/example_file.txt`;
      await fs.writeTextFile('example_file.txt', 'This is from TAURI!\n', { dir: fs.BaseDirectory.Download });
      await shell.open(downloads!);
      await invoke('process_file', { filepath: filePath }).then(msg => {
        notify('Message from Rust', msg as string);
        notifications.show({ title: 'Message from Rust', message: msg as string });
      });
    }
  }

  if (loading) {
    return <div className="flex-1 p-6 text-white">Loading...</div>;
  }

  return (
    <div className="flex-1 p-6">
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Chat
        </button>
        <Title order={4} className="text-white mb-4">Tauri Framework Examples</Title>

        <Stack gap="md">
          <Group>
            <Button onClick={createFile} className="bg-blue-600 hover:bg-blue-700">
              Create File Example
            </Button>
            <Button onClick={toggleFullscreen} className="bg-blue-600 hover:bg-blue-700">
              Toggle Fullscreen
            </Button>
            <Button
              onClick={() => notifications.show({
                title: 'Notification Example',
                message: 'This is a test notification'
              })}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Show Notification
            </Button>
          </Group>

          <div className="space-y-4">
            <Title order={4} className="text-white">Translation Example</Title>
            <Trans
              i18nKey='transExample'
              values={{ variable: '/elibroftw/modern-desktop-template' }}
              components={[
                <Anchor href="https://github.com/elibroftw/modern-desktop-app-template" />
              ]}
              default='Template is at <0>github.com{{variable}}</0>'
              t={t}
            />
          </div>

          <div>
            <Text className="text-gray-300 mb-2">Persistent Data Example:</Text>
            <TextInput
              value={exampleData}
              onChange={e => setExampleData(e.currentTarget.value)}
              placeholder="Type something to save..."
              className="max-w-md"
            />
          </div>
        </Stack>
      </div>
    </div>
  );
}