// src/views/NovelView/NovelContent.tsx
import { ChevronDown, Plus, Filter } from 'lucide-react';

export function NovelContent() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Act 1</h2>
            <ChevronDown size={20} className="text-gray-400" />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent">
              New Chapter
            </button>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Chapter 1</h3>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Scene 1</span>
            </div>
            <textarea
              placeholder="Add summary..."
              className="w-full mt-2 p-2 bg-transparent border-none resize-none focus:ring-0"
              rows={3}
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">Label</span>
            </div>
          </div>

          <button className="w-full py-2 text-sm text-gray-500 hover:bg-light-accent dark:hover:bg-dark-accent rounded-lg">
            + New Scene
          </button>
        </div>

        <div className="flex gap-2 mt-6">
          <button className="px-3 py-1 text-sm border rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent">
            Add Act
          </button>
          <button className="px-3 py-1 text-sm border rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent">
            Create from Outline
          </button>
          <button className="px-3 py-1 text-sm border rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent">
            Import
          </button>
          <button className="px-3 py-1 text-sm border rounded-lg hover:bg-light-accent dark:hover:bg-dark-accent">
            Actions
          </button>
        </div>
      </div>
    </div>
  );
}