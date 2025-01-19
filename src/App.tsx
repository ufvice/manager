import { useTauriContext } from './tauri/TauriProvider';
import { TitleBar } from './tauri/TitleBar';
import { AppShell } from './components/layout/app-shell';

export default function App() {
  const { usingCustomTitleBar } = useTauriContext();

  return (
    <>
      {usingCustomTitleBar && <TitleBar />}
      <div className="h-screen bg-light-bg dark:bg-dark-bg">
        <AppShell />
      </div>
    </>
  );
}