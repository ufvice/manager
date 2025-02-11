import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
}

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
        a: ({ node, ...props }) => (
          <a target="_blank" rel="noopener noreferrer" {...props} />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}