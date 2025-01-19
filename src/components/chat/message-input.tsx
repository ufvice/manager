import { Search, Plus, Paperclip, Link2, Mic } from 'lucide-react'

export function MessageInput() {
  return (
    <div className="p-4 border-t border-gray-800">
      <div className="bg-gray-800 rounded-lg p-2">
        <input
          type="text"
          placeholder="Type '@' to mention an AI agent"
          className="w-full bg-transparent border-none outline-none px-2 text-gray-200 placeholder:text-gray-400 mb-2"
        />
        <div className="flex justify-start gap-2">
          <ActionButton icon={Search} />
          <ActionButton icon={Plus} />
          <ActionButton icon={Paperclip} />
          <ActionButton icon={Link2} />
          <ActionButton icon={Mic} />
        </div>
      </div>
    </div>
  )
}

function ActionButton({ icon: Icon }) {
  return (
    <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200">
      <Icon className="w-5 h-5" />
    </button>
  )
}

