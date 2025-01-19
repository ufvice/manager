import { Sun, Moon } from "lucide-react"
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  children: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="flex items-center p-4 border-b transition-colors duration-200">
      {children}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-colors duration-200"
      >
        {theme === 'dark' ?
          <Sun className="w-5 h-5" /> :
          <Moon className="w-5 h-5" />
        }
      </button>
    </header>
  )
}

