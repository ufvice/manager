import { useEffect, useState } from 'react';
import { Modal, Tabs, Button, Group } from '@mantine/core';
import { ZoomIn, ZoomOut, Download, Copy, Check } from 'lucide-react';

declare global {
  interface Window {
    mermaid?: {
      contentLoaded?: () => void;
    };
  }
}

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);
  const mermaidId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Initialize mermaid after component mounts
    window?.mermaid?.contentLoaded?.();
  }, []);

  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.1, Math.min(3, scale + delta));
    setScale(newScale);

    const element = document.getElementById(mermaidId);
    if (!element) return;

    const svg = element.querySelector('svg');
    if (!svg) return;

    svg.style.transform = `scale(${newScale})`;
    svg.style.transformOrigin = 'top left';
  };

  const handleDownload = async (format: 'svg' | 'png') => {
    const element = document.getElementById(mermaidId);
    if (!element) return;

    const svg = element.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    if (format === 'svg') {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagram-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagram-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      };
      img.src = url;
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        id={mermaidId}
        className="mermaid cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsOpen(true)}
      >
        {chart}
      </div>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mermaid Diagram"
        size="xl"
        centered
      >
        <Tabs defaultValue="preview">
          <Tabs.List>
            <Tabs.Tab value="preview">Preview</Tabs.Tab>
            <Tabs.Tab value="source">Source</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="preview">
            <Group gap="xs" mb="md">
              <Button variant="light" size="sm" onClick={() => handleZoom(0.1)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="light" size="sm" onClick={() => handleZoom(-0.1)}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="light" size="sm" onClick={() => handleDownload('svg')}>
                SVG
              </Button>
              <Button variant="light" size="sm" onClick={() => handleDownload('png')}>
                PNG
              </Button>
            </Group>

            <div className="overflow-auto max-h-[60vh]">
              <div className="mermaid" id={`${mermaidId}-preview`}>
                {chart}
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="source">
            <div className="flex justify-end mb-2">
              <Button variant="light" size="sm" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <pre className="p-4 rounded-lg bg-light-accent dark:bg-dark-accent overflow-auto max-h-[60vh]">
              <code>{chart}</code>
            </pre>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
}