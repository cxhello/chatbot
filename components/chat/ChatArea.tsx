'use client';

import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChatStore } from '@/store/useChatStore';
import { useStore } from '@/store/useStore';
import { useEffect, useRef } from 'react';

export function ChatArea() {
  const { user } = useStore();
  const { currentChat, isLoading, sendMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async (content: string) => {
    if (!user || !currentChat) return;
    await sendMessage(content);
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col flex-1 h-[calc(100vh-64px)] items-center justify-center text-gray-500">
        <p>选择一个对话或开始新对话</p>
      </div>
    );
  }

  // 对消息进行排序，确保按时间戳升序排列
  const sortedMessages = [...currentChat.messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto">
        {sortedMessages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isLoading={isLoading && index === sortedMessages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
} 