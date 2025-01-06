'use client';

import React from 'react';
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[85%]`}>
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
              U
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white">
              AI
            </div>
          )}
        </div>
        <div
          className={`
            py-3 px-4 rounded-2xl overflow-hidden
            ${isUser 
              ? 'bg-indigo-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }
          `}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={`prose max-w-none ${isUser ? 'prose-invert' : ''}`}>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} rounded-md px-1 py-0.5 bg-gray-700/10`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    const items = React.Children.toArray(children).filter(
                      child => React.isValidElement(child) && child.props.children
                    );

                    return (
                      <ul className="space-y-1.5 mb-4 last:mb-0">
                        {items.map((child, index) => (
                          <li key={index} className="flex gap-2 items-baseline">
                            <span className="text-sm opacity-70 w-4 text-right">•</span>
                            <span className="leading-normal">
                              {React.isValidElement(child) ? child.props.children : child}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  },
                  ol({ children, start = 1 }) {
                    const items = React.Children.toArray(children).filter(
                      child => React.isValidElement(child) && child.props.children
                    );

                    return (
                      <ol className="space-y-1.5 mb-4 last:mb-0">
                        {items.map((child, index) => (
                          <li key={index} className="flex gap-2 items-baseline">
                            <span className="text-sm opacity-70 w-6 text-right">
                              {start + index}.
                            </span>
                            <span className="leading-normal">
                              {React.isValidElement(child) ? child.props.children : child}
                            </span>
                          </li>
                        ))}
                      </ol>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 