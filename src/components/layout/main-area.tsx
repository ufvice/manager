import { AgentGrid } from "../agents/agent-grid"

export function MainArea() {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="bg-green-600 text-white px-4 py-2 rounded-lg mb-6">
        ✨ Introducing: Edit in Canvas
      </div>

      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8qTK8waoewlfZTdvXog4VK60olbgat.png"
            alt="TypingMind Logo"
            className="w-8 h-8"
          />
        </div>
        <div className="ml-4 text-2xl font-bold">
          Typing<span className="text-blue-500">Mind</span>
        </div>
      </div>

      <AgentGrid />
    </div>
  )
}

