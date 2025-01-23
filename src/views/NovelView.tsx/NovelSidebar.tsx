// src/views/NovelView/NovelSidebar.tsx
import { Search, Plus, Settings } from 'lucide-react';

export function NovelSidebar() {
  return (
    <div className="w-72 border-r border-light-border dark:border-dark-border flex flex-col">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Codex</h2>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-light-accent dark:hover:bg-dark-accent rounded">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search all entries..."
            className="w-full pl-9 pr-3 py-2 bg-light-accent dark:bg-dark-accent rounded-lg"
          />
        </div>

        <button className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={16} />
          New Entry
        </button>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            The Codex stores information about the world your story takes place in, its inhabitants and more.
          </p>
          <span className="text-gray-400 text-sm">
            Create a new entry by clicking the button above.
          </span>
        </div>
      </div>
    </div>
  );
}