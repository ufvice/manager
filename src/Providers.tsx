import '@fontsource/open-sans';
import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Mantine from './components/Mantine';
import { TauriProvider } from './tauri/TauriProvider';
import { ThemeProvider } from './components/ThemeProvider';
import { ConfigProvider } from './contexts/ConfigContext';

export default function ({ children }: PropsWithChildren) {
  return (
    <TauriProvider>
      <ThemeProvider>
        <Mantine>
          <ConfigProvider>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </ConfigProvider>
        </Mantine>
      </ThemeProvider>
    </TauriProvider>
  );
}