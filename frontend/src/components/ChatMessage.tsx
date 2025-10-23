import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import ActionExecutor from './ActionExecutor';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  apiBaseUrl: string;
}

const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ content, role, apiBaseUrl }) => {
  if (role === 'user') {
    // User messages: simple text rendering
    return (
      <p className="whitespace-pre-wrap">{content}</p>
    );
  }

  // Detect ACTION blocks in assistant messages
  if (role === 'assistant' && content.trim().startsWith('ACTION:')) {
    try {
      const actionPayload = content.replace(/^ACTION:\s*/, '').trim();
      const action = JSON.parse(actionPayload);

      return <ActionExecutor action={action} apiBaseUrl={apiBaseUrl} />;
    } catch (error) {
      // If JSON parsing fails, show error message
      return (
        <div className="my-2 p-2 bg-error/10 border border-error rounded">
          <p className="text-error font-semibold text-xs">⚠️ Invalid ACTION format</p>
          <p className="text-error text-xs mt-1">Failed to parse ACTION block</p>
          <pre className="mt-1 p-2 bg-surface rounded border border-border text-xs text-error overflow-x-auto">
            {content}
          </pre>
        </div>
      );
    }
  }

  // Assistant messages: rich Markdown rendering with wrapper div for className
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-text-primary prose-p:text-text-primary prose-a:text-primary prose-strong:text-text-primary prose-code:text-success prose-pre:bg-surface prose-pre:border prose-pre:border-border">
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
                  <div className="absolute top-1 right-1 text-xs text-text-tertiary font-mono uppercase">
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
                className="px-1 py-0.5 bg-surface-elevated border border-border rounded text-success text-xs font-mono"
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
                className="p-2 rounded overflow-x-auto bg-surface border border-border my-2"
                {...props}
              >
                {children}
              </pre>
            );
          },
          // Custom list styling
          ul({ children, ...props }: any) {
            return (
              <ul className="space-y-1 my-2" {...props}>
                {children}
              </ul>
            );
          },
          ol({ children, ...props }: any) {
            return (
              <ol className="space-y-1 my-2" {...props}>
                {children}
              </ol>
            );
          },
          li({ children, ...props }: any) {
            return (
              <li className="text-text-primary text-xs" {...props}>
                {children}
              </li>
            );
          },
          // Custom heading styling
          h1({ children, ...props }: any) {
            return (
              <h1 className="text-base font-bold text-text-primary mt-3 mb-2" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            return (
              <h2 className="text-sm font-bold text-text-primary mt-3 mb-1" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            return (
              <h3 className="text-sm font-semibold text-text-primary mt-2 mb-1" {...props}>
                {children}
              </h3>
            );
          },
          // Custom paragraph styling
          p({ children, ...props }: any) {
            return (
              <p className="text-text-primary text-xs leading-relaxed my-1" {...props}>
                {children}
              </p>
            );
          },
          // Custom blockquote styling
          blockquote({ children, ...props }: any) {
            return (
              <blockquote
                className="border-l-2 border-primary pl-2 py-1 my-2 bg-surface-elevated/50 italic text-text-secondary text-xs"
                {...props}
              >
                {children}
              </blockquote>
            );
          },
          // Custom table styling
          table({ children, ...props }: any) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="min-w-full border border-border" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th className="border border-border bg-surface-elevated px-2 py-1 text-left text-text-primary text-xs font-semibold" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td className="border border-border px-2 py-1 text-text-primary text-xs" {...props}>
                {children}
              </td>
            );
          },
          // Custom link styling
          a({ children, href, ...props }: any) {
            return (
              <a
                href={href}
                className="text-primary hover:text-primary-hover underline transition-colors text-xs"
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
