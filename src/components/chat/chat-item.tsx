interface ChatItemProps {
  title: string
  preview: string
  time: string
  isActive?: boolean
}

export function ChatItem({ title, preview, time, isActive }: ChatItemProps) {
  return (
    <div className={`flex items-center p-4 hover:bg-gray-800 cursor-pointer ${isActive ? 'bg-gray-800' : ''
      }`}>
      <div className="w-8 h-8 rounded-full bg-purple-600 flex-shrink-0" />
      <div className="ml-3 flex-grow overflow-hidden">
        <div className="text-sm text-gray-200">{title}</div>
        <div className="text-xs text-gray-400 truncate">{preview}</div>
      </div>
      <div className="text-xs text-gray-500 ml-2">{time}</div>
    </div>
  )
}

