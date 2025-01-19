import { MessageSquare, Search } from 'lucide-react'
import { ChatList } from "../chat/chat-list"

interface SecondarySidebarProps {
  isCollapsed: boolean
}

export function SecondarySidebar({ isCollapsed }: SecondarySidebarProps) {
  if (isCollapsed) {
    return null
  }

  return (
    <div className="w-80 flex flex-col border-r border-gray-800 bg-gray-900">
      <div className="p-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <span>New chat</span>
        </button>
      </div>

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

      <div className="flex-1 overflow-y-auto">
        <ChatList />
      </div>
    </div>
  )
}

