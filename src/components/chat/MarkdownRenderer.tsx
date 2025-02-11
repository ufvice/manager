import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

// Convert modern math notation to LaTeX style
function convertMathDelimiters(content: string): string {
  return content
    // Convert inline math \(...\) to $...$
    .replace(/\\\((.*?)\\\)/g, (_, match) => `$${match}$`)
    // Convert display math \[...\] to $$...$$
    .replace(/\\\[(.*?)\\\]/g, (_, match) => `$$${match}$$`);
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      className="prose dark:prose-invert max-w-none"
      components={{
        // 自定义渲染组件
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline ? (
            <pre className={`bg-light-accent/50 dark:bg-dark-accent/50 p-4 rounded-lg ${className}`}>
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-light-accent/50 dark:bg-dark-accent/50 px-1 py-0.5 rounded" {...props}>
              {children}
            </code>
          );
        },
        // 自定义链接在新窗口打开
        a: ({ node, ...props }) => (
          <a target="_blank" rel="noopener noreferrer" {...props} />
        ),
      }}
    >
      {convertMathDelimiters(content)}
    </ReactMarkdown>
  );
}