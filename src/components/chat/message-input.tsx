import { Search, Plus, Paperclip, Link2, Mic } from 'lucide-react'

export function MessageInput() {
  return (
    <div className="p-4 border-t border-light-border dark:border-dark-border">
      <div className="bg-light-accent dark:bg-dark-accent rounded-lg p-2">
        <input
          type="text"
          placeholder="Type '@' to mention an AI agent"
          className="w-full bg-transparent border-none outline-none px-2 text-light-text dark:text-dark-text placeholder:text-light-text/50 dark:placeholder:text-dark-text/50 mb-2"
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
    <button className="p-2 hover:bg-light-accent/70 dark:hover:bg-dark-accent/70 rounded text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text">
      <Icon className="w-5 h-5" />
    </button>
  )
}

