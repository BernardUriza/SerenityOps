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
        <div className="my-2 p-2 bg-error/10 border border-error rounded-mac backdrop-blur-md shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
          <p className="text-error font-semibold text-xs">Invalid ACTION format</p>
          <p className="text-error text-xs mt-1">Failed to parse ACTION block</p>
          <pre className="mt-2 p-2 bg-macBg rounded-mac border border-macBorder/40 text-xs text-error overflow-x-auto">
            {content}
          </pre>
        </div>
      );
    }
  }

  // Assistant messages: rich Markdown rendering with wrapper div for className
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-macText prose-p:text-macText prose-a:text-macAccent prose-strong:text-macText prose-code:text-success prose-pre:bg-macBg prose-pre:border prose-pre:border-macBorder/40">
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
                  <div className="absolute top-1 right-1 text-xs text-macSubtext font-mono uppercase">
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
                className="px-1 py-0.5 bg-macPanel/70 border border-macBorder/40 rounded-mac text-success text-xs font-mono"
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
                className="p-2 rounded-mac overflow-x-auto bg-macBg border border-macBorder/40 my-2"
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
              <li className="text-macText text-xs" {...props}>
                {children}
              </li>
            );
          },
          // Custom heading styling
          h1({ children, ...props }: any) {
            return (
              <h1 className="text-base font-bold text-macText mt-3 mb-2" {...props}>
                {children}
              </h1>
            );
          },
          h2({ children, ...props }: any) {
            return (
              <h2 className="text-sm font-bold text-macText mt-3 mb-1" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            return (
              <h3 className="text-sm font-semibold text-macText mt-2 mb-1" {...props}>
                {children}
              </h3>
            );
          },
          // Custom paragraph styling
          p({ children, ...props }: any) {
            return (
              <p className="text-macText text-xs leading-relaxed my-1" {...props}>
                {children}
              </p>
            );
          },
          // Custom blockquote styling
          blockquote({ children, ...props }: any) {
            return (
              <blockquote
                className="border-l-2 border-macAccent pl-2 py-1 my-2 bg-macPanel/70 italic text-macSubtext text-xs"
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
                <table className="min-w-full border border-macBorder/40" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          th({ children, ...props }: any) {
            return (
              <th className="border border-macBorder/40 bg-macPanel/70 px-3 py-2 text-left text-macText text-xs font-semibold" {...props}>
                {children}
              </th>
            );
          },
          td({ children, ...props }: any) {
            return (
              <td className="border border-macBorder/40 px-3 py-2 text-macText text-xs" {...props}>
                {children}
              </td>
            );
          },
          // Custom link styling
          a({ children, href, ...props }: any) {
            return (
              <a
                href={href}
                className="text-macAccent hover:text-macAccent underline transition-all duration-300 ease-mac text-xs"
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
