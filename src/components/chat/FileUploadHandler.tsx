import { useRef } from 'react';
import { Upload } from 'lucide-react';
import mime from 'mime';
import { FileAttachment } from '@/types/chat';

interface FileUploadHandlerProps {
  onFileAdd: (attachments: FileAttachment[]) => void;
  onError: (message: string) => void;
}

export function FileUploadHandler({ onFileAdd, onError }: FileUploadHandlerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const newAttachments: FileAttachment[] = [];
    const errors: string[] = [];

    for (const file of Array.from(files)) {
      const mimeType = mime.getType(file.name);

      if (!mimeType?.startsWith('text/')) {
        errors.push(`${file.name} is not a text file`);
        continue;
      }

      try {
        const content = await file.text();
        newAttachments.push({
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          content,
          type: mimeType
        });
      } catch (error) {
        errors.push(`Error reading ${file.name}`);
      }
    }

    if (errors.length > 0) {
      onError(errors.join('\n'));
    }

    if (newAttachments.length > 0) {
      onFileAdd(newAttachments);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="text/*"
        multiple
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-light-accent/70 dark:hover:bg-dark-accent/70 rounded text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text"
        title="Upload text files"
      >
        <Upload className="w-5 h-5" />
      </button>
    </div>
  );
}