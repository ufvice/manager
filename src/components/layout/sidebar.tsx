import { MessageSquare, Search, Bot, FileText, Puzzle, Box, Users, Settings } from 'lucide-react'
import { ChatList } from "../chat/chat-list"
import { NavigationItem } from "../navigation/navigation-item"

interface SidebarProps {
  isCollapsed: boolean
}

const navigationItems = [
  { icon: MessageSquare, label: "Chat" },
  { icon: Bot, label: "Agents" },
  { icon: FileText, label: "Prompts" },
  { icon: Puzzle, label: "Plugins" },
  { icon: Box, label: "Models" },
  { icon: Users, label: "Teams" },
  { icon: Settings, label: "Settings" },
]

export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-80"
        } flex flex-col border-r border-gray-800 transition-all duration-300`}
    >
      <div className="p-4">
        <button className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 ${isCollapsed ? "px-2" : ""
          }`}>
          <MessageSquare className="w-5 h-5" />
          {!isCollapsed && <span>New chat</span>}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats"
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-gray-200 placeholder:text-gray-400"
            />
          </div>
        </div>
      )}

      <nav className="flex flex-col px-2 space-y-1">
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && <ChatList />}
      </div>
    </div>
  )
}

