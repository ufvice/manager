interface AgentCardProps {
  name: string
  icon: string
}

export function AgentCard({ name, icon }: AgentCardProps) {
  return (
    <div className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        {icon}
      </div>
      <span className="ml-3 text-sm text-gray-200">{name}</span>
    </div>
  )
}

