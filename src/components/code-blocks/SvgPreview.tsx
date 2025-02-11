import { useState } from 'react';
import { Modal, Button, Group } from '@mantine/core';
import { Download, Maximize2 } from 'lucide-react';

interface SvgPreviewProps {
  content: string;
}

export function SvgPreview({ content }: SvgPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="relative group">
        <div
          className="bg-white rounded-lg p-4 cursor-pointer"
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={() => setIsOpen(true)}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="subtle"
            size="compact-sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="subtle"
            size="compact-sm"
            onClick={() => setIsOpen(true)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="SVG Preview"
        size="xl"
        centered
      >
        <div className="p-4 bg-white rounded-lg overflow-auto max-h-[80vh]">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        <Group justify="flex-end" mt="md">
          <Button
            variant="light"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download SVG
          </Button>
        </Group>
      </Modal>
    </>
  );
}