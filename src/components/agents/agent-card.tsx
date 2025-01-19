interface AgentCardProps {
  name: string
  icon: string
}

export function AgentCard({ name, icon }: AgentCardProps) {
  return (
    <div className="flex items-center p-4 bg-light-accent dark:bg-dark-accent rounded-lg hover:bg-light-accent/70 dark:hover:bg-dark-accent/70 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
        {icon}
      </div>
      <span className="ml-3 text-sm text-light-text dark:text-dark-text">{name}</span>
    </div>
  )
}

