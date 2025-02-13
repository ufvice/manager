import { FileAttachment } from '@/types/chat';

export function formatFileContent(file: FileAttachment): string {
  return `[file name]: ${file.name}
[file content begin]
${file.content}
[file content end]`;
}

export function formatMessageWithFiles(message: string, attachments: FileAttachment[]): string {
  const parts: string[] = [];

  // Add file contents first
  if (attachments.length > 0) {
    const filesContent = attachments
      .map(file => formatFileContent(file))
      .join('\n\n');
    parts.push(filesContent);
  }

  // Add message text if exists
  if (message.trim()) {
    parts.push(message.trim());
  }

  return parts.join('\n\n');
}