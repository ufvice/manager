// src/views/NovelView/index.tsx
import { Book, Settings, Filter } from 'lucide-react';
import { NovelSidebar } from './NovelSidebar';
import { NovelContent } from './NovelContent';

export function NovelView() {
  return (
    <div className="flex h-full">
      <NovelSidebar />
      <NovelContent />
    </div>
  );
}