import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from "../header"
import { MessageInput } from "../chat/message-input"
import { MainArea } from "./main-area"

interface MainContentProps {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function MainContent({ isSidebarCollapsed, onToggleSidebar }: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Header>
        <button
          className="p-2 hover:bg-light-accent dark:hover:bg-dark-accent rounded-lg text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text"
          onClick={onToggleSidebar}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm font-medium">Chat UI</span>
        </div>
      </Header>
      <MainArea />
      <MessageInput />
    </div>
  )
}