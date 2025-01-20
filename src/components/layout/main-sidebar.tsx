import { MessageSquare, Bot, FileText, Puzzle, Box, Settings, Beaker, Database } from 'lucide-react'
import { NavigationItem } from "../navigation/navigation-item"
import { useLocation, useNavigate } from 'react-router-dom'

interface MainSidebarProps {
  isCollapsed: boolean
}

const navigationItems = [
  { icon: MessageSquare, label: "Chat", path: "/" },
  { icon: Bot, label: "Agents", path: "/agents" },
  { icon: FileText, label: "Prompts", path: "/prompts" },
  { icon: Puzzle, label: "Plugins", path: "/plugins" },
  { icon: Box, label: "Models", path: "/models" },
  { icon: Beaker, label: "Examples", path: "/examples" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Database, label: "Storage Demo", path: "/storage-demo" }
]

export function MainSidebar({ isCollapsed }: MainSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`${isCollapsed ? "w-16" : "w-20"} flex flex-col bg-light-sidebar dark:bg-dark-sidebar border-r border-light-border dark:border-dark-border`}>
      <nav className="flex flex-col py-4 gap-2">
        {navigationItems.map((item) => (
          <div
            key={item.path}
            onClick={() => {
              console.log('Navigating to:', item.path);
              navigate(item.path);
            }}
            className="cursor-pointer"
          >
            <NavigationItem
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
            />
          </div>
        ))}
      </nav>
    </div>
  );
}