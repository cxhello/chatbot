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
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`py-4 px-6 ${isAssistant ? 'bg-gray-50' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <div className="font-medium mb-1">
          {isAssistant ? 'AI 助手' : '你'}
        </div>
        {message.reasoning_content && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-md text-sm">
            <div className="font-medium text-yellow-800 mb-1">推理过程：</div>
            <ReactMarkdown className="text-yellow-700">
              {message.reasoning_content}
            </ReactMarkdown>
          </div>
        )}
        <div className="prose max-w-none">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
} 