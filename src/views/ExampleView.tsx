import { Button, Stack, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { MessageSquare, Sun, Moon, Bell, Globe } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { useTheme } from '../components/ThemeProvider';
import { createStorage } from '../tauri/storage';
import { useTauriContext } from '../tauri/TauriProvider';

interface ExamplesViewProps {
  onBack: () => void;
}

export function ExamplesView({ onBack }: ExamplesViewProps) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { fileSep, documents } = useTauriContext();

  // 演示存储API的使用
  const storeName = `${documents}${fileSep}example_data.json`;
  const { use: useStoredValue, loading } = createStorage(storeName);
  const [storedText, setStoredText] = useStoredValue('exampleText', '');

  // 演示通知API的使用
  const showNotification = () => {
    notifications.show({
      title: 'Example Notification',
      message: 'This is a test notification',
      icon: <Bell size={16} />,
    });
  };

  // 演示语言切换
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="subtle"
          leftSection={<MessageSquare size={16} />}
          onClick={onBack}
        >
          Back
        </Button>
      </div>

      <Stack gap="xl">
        <Title order={2}>API Examples</Title>

        {/* 主题切换示例 */}
        <div className="space-y-2">
          <Title order={4}>Theme Switching</Title>
          <Button
            onClick={toggleTheme}
            leftSection={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>

        {/* 国际化示例 */}
        <div className="space-y-2">
          <Title order={4}>Internationalization</Title>
          <Button
            onClick={toggleLanguage}
            leftSection={<Globe size={16} />}
          >
            Toggle Language
          </Button>
          <Text>
            <Trans i18nKey="transExample" />
          </Text>
        </div>

        {/* 通知示例 */}
        <div className="space-y-2">
          <Title order={4}>Notifications</Title>
          <Button onClick={showNotification}>
            Show Notification
          </Button>
        </div>

        {/* 持久化存储示例 */}
        <div className="space-y-2">
          <Title order={4}>Persistent Storage</Title>
          {loading ? (
            <Text>Loading stored data...</Text>
          ) : (
            <TextInput
              placeholder="Type something to store..."
              value={storedText}
              onChange={(e) => setStoredText(e.currentTarget.value)}
              className="max-w-md"
            />
          )}
        </div>
      </Stack>
    </div>
  );
}