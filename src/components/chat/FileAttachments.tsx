import { X, GripHorizontal } from 'lucide-react';
import { FileAttachment } from '@/types/chat';
import { useState, useRef } from 'react';

interface FileAttachmentsProps {
  attachments: FileAttachment[];
  onRemove: (id: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  id: string;
  index: number;
}

export function FileAttachments({ attachments, onRemove, onReorder }: FileAttachmentsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;

    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragCounter.current = 0;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {attachments.map((file, index) => (
        <div
          key={file.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className={`flex items-center gap-2 bg-light-accent/50 dark:bg-dark-accent/50 px-2 py-1 rounded-lg group cursor-move ${draggedIndex === index ? 'opacity-50' : ''
            }`}
        >
          <GripHorizontal className="w-4 h-4 text-light-text/30 dark:text-dark-text/30" />
          <span className="text-sm truncate max-w-[150px]">{file.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(file.id);
            }}
            className="p-1 hover:bg-light-accent dark:hover:bg-dark-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}