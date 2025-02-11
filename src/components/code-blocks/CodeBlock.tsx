import { CheckIcon, Copy, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { MermaidDiagram } from './MermaidDiagram';
import { SvgPreview } from './SvgPreview';

interface CodeBlockProps {
  children: string;
  className?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
}

export default function CodeBlock({ children, className, showLineNumbers = true, collapsible = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [shouldShowExpandButton, setShouldShowExpandButton] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const language = className?.replace(/language-/, '') || 'text';
  const showDownloadButton = ['csv', 'json', 'txt', 'md'].includes(language);

  useEffect(() => {
    if (codeRef.current) {
      setShouldShowExpandButton(codeRef.current.scrollHeight > 350);
    }
  }, [children]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([children], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (language === 'mermaid') {
    return <MermaidDiagram chart={children} />;
  }

  if (language === 'svg') {
    return <SvgPreview content={children} />;
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between px-4 py-2 bg-light-accent dark:bg-dark-accent">
        <div className="flex items-center gap-2">
          {collapsible && shouldShowExpandButton && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <span className="text-sm font-medium">{`<${language.toUpperCase()}>`}</span>
        </div>
        <div className="flex items-center gap-2">
          {showDownloadButton && (
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-md text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text hover:bg-light-accent/50 dark:hover:bg-dark-accent/50"
            >
              <Download size={16} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text hover:bg-light-accent/50 dark:hover:bg-dark-accent/50"
          >
            {copied ? <CheckIcon size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div
        ref={codeRef}
        className="relative"
        style={{
          maxHeight: collapsible && !isExpanded ? '350px' : 'none',
          overflow: collapsible && !isExpanded ? 'hidden' : 'visible',
        }}
      >
        <pre className={`p-4 overflow-x-auto ${showLineNumbers ? 'line-numbers' : ''}`}>
          <code className={className}>{children}</code>
        </pre>
      </div>

      {collapsible && shouldShowExpandButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-0 left-0 right-0 p-2 text-center text-sm text-light-text/50 dark:text-dark-text/50 hover:text-light-text dark:hover:text-dark-text bg-gradient-to-t from-light-bg dark:from-dark-bg"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}