import { AgentCard } from "./agent-card"

const agents = [
  { name: "破限R", icon: "🤖" },
  { name: "AI assistant Nova", icon: "🤖" },
  { name: "Nova by DeepThink", icon: "🤖" },
  { name: "写作助手", icon: "🤖" },
]

export function AgentGrid() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your AI agents</h2>
        <div className="flex gap-4">
          <button className="text-blue-500 text-sm hover:underline">Edit</button>
          <button className="text-blue-500 text-sm hover:underline">
            View all (18)
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </div>
    </div>
  )
}

