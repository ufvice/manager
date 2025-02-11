import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CodeBlock from '../code-blocks/CodeBlock';
import { SvgPreview } from '../code-blocks/SvgPreview';
import { useEffect } from 'react';
import mermaid from 'mermaid';


interface MarkdownRendererProps {
  content: string;
}

type MarkdownCodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

function MermaidDiagram({ children }: { children: React.ReactNode }) {
  const diagramId = `mermaid-${Math.random().toString(36).substring(7)}`;

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        // 清除之前的内容
        const element = document.getElementById(diagramId);
        if (element) {
          await mermaid.run({
            nodes: [element]
          });
        }
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error);
      }
    };

    renderDiagram();
  }, [children, diagramId]);

  return (
    <div className="flex justify-center my-4">
      <div id={diagramId} className="mermaid">
        {children}
      </div>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      className="prose dark:prose-invert max-w-none"
      components={{
        code({ node, inline, className, children, ...props }: MarkdownCodeProps) {
          const match = /language-(\w+)/.exec(className || '');
          if (!inline && match) {
            const language = match[1];
            if (language === 'mermaid') {
              return <MermaidDiagram>{children}</MermaidDiagram>;
            }
            if (language === 'svg') {
              return <SvgPreview content={String(children)} />;
            }
            return (
              <CodeBlock className={className}>
                {String(children)}
              </CodeBlock>
            );
          }
          return (
            <code className="bg-light-accent/50 dark:bg-dark-accent/50 px-1 py-0.5 rounded" {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}