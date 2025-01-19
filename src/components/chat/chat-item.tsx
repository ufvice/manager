interface ChatItemProps {
  title: string
  preview: string
  time: string
  isActive?: boolean
}

export function ChatItem({ title, preview, time, isActive }: ChatItemProps) {
  return (
    <div className={`flex items-center p-4 hover:bg-light-accent dark:hover:bg-dark-accent cursor-pointer ${isActive ? 'bg-light-accent dark:bg-dark-accent' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
      <div className="ml-3 flex-grow overflow-hidden">
        <div className="text-sm text-light-text dark:text-dark-text">{title}</div>
        <div className="text-xs text-light-text/70 dark:text-dark-text/70 truncate">{preview}</div>
      </div>
      <div className="text-xs text-light-text/50 dark:text-dark-text/50 ml-2">{time}</div>
    </div>
  )
}

