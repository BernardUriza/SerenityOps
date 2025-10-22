import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ content, role }) => {
  if (role === 'user') {
    // User messages: simple text rendering
    return (
      <p className="whitespace-pre-wrap">{content}</p>
    );
  }

  // Assistant messages: rich Markdown rendering with wrapper div for className
  return (
    <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-200 prose-p:text-slate-300 prose-a:text-blue-400 prose-strong:text-slate-100 prose-code:text-emerald-400 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        skipHtml={true}
        components={{
          // Custom code block styling
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');

            if (!inline && match) {
              // Block code with language
              return (
                <div className="relative">
                  <div className="absolute top-2 right-2 text-xs text-slate-500 font-mono uppercase">
                    {match[1]}
                  </div>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              );
            }

            // Inline code
            return (
              <code
                className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-emerald-400 text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom pre block styling
          pre({ children, ...props }: any) {
            return (
              <pre
                className="p-4 rounded-lg overflow-x-auto bg-slate-950 border border-slate-700 my-4"
                {...props}
              >
                {children}
              </pre>
            );
          },
          // Custom list styling
          ul({ children, ...props }: any) {
            return (
              <ul className="space-y-2 my-3" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: any) {
            return (
              <ol className="space-y-2 my-3" {...props}>
                {children}
              </ol>
            );
          },
          li({ children, ...props }: any) {
            return (
              <li className="text-slate-300" {...props}>
                {children}
              </li>
            );
          },
          // Custom heading styling
          h1({ children, ...props }: any) {
            return (
              <h1 className="text-2xl font-bold text-slate-100 mt-6 mb-3" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            return (
              <h2 className="text-xl font-bold text-slate-100 mt-5 mb-2" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            return (
              <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2" {...props}>
                {children}
              </h3>
            );
          },
          // Custom paragraph styling
          p({ children, ...props }: any) {
            return (
              <p className="text-slate-300 leading-relaxed my-2" {...props}>
                {children}
              </p>
            );
          },
          // Custom blockquote styling
          blockquote({ children, ...props }: any) {
            return (
              <blockquote
                className="border-l-4 border-blue-600 pl-4 py-2 my-4 bg-slate-900/50 italic text-slate-400"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Custom table styling
          table({ children, ...props }: any) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-slate-700" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th className="border border-slate-700 bg-slate-900 px-4 py-2 text-left text-slate-300 font-semibold" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td className="border border-slate-700 px-4 py-2 text-slate-300" {...props}>
                {children}
              </td>
            );
          },
          // Custom link styling
          a({ children, href, ...props }: any) {
            return (
              <a
                href={href}
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
