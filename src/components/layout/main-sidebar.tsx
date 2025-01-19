import { MessageSquare, Bot, FileText, Puzzle, Box, Settings, Beaker } from 'lucide-react'
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
]

export function MainSidebar({ isCollapsed }: MainSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`${isCollapsed ? "w-16" : "w-20"
      } flex flex-col bg-gray-950 border-r border-gray-800 transition-all duration-300`}>
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