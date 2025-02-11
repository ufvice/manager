import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CodeBlock from '../code-blocks/CodeBlock';
import { MermaidDiagram } from '../code-blocks/MermaidDiagram';
import { SvgPreview } from '../code-blocks/SvgPreview';

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

// 将现代LaTeX符号转换为传统符号
function convertLatexDelimiters(text: string): string {
  const pattern = /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(pattern, (match, codeBlock, displayMath, inlineMath) => {
    if (codeBlock) {
      // 保持代码块不变
      return codeBlock;
    } else if (displayMath) {
      // 将 \[...\] 转换为 $$...$$
      return `
$$
${displayMath}
$$
`;
    } else if (inlineMath) {
      // 将 \(...\) 转换为 $...$
      return `$${inlineMath}$`;
    }
    return match;
  });
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 先转换LaTeX分隔符，再传给Markdown渲染器
  const processedContent = convertLatexDelimiters(content);

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
              return <MermaidDiagram chart={String(children)} />;
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
        },
        a: ({ node, ...props }) => (
          <a target="_blank" rel="noopener noreferrer" {...props} />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}