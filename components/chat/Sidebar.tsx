'use client';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import { useChatStore } from '@/store/useChatStore';
import { useEffect } from 'react';
import { Chat } from '@/types/chat';
import { ErrorMessage } from '../ui/ErrorMessage';
import { NewChatButton } from './NewChatButton';
import { ModelType } from '@/types/chat';

export function Sidebar() {
  const { user } = useStore();
  const { 
    chats, 
    currentChat,
    isLoading,
    error,
    fetchChats, 
    startNewChat, 
    deleteChat,
    setCurrentChat 
  } = useChatStore();

  useEffect(() => {
    if (user) {
      fetchChats(user.id);
    }
  }, [user, fetchChats]);

  const handleNewChat = async (message: string, model: ModelType) => {
    if (!user) return;
    await startNewChat(user.id, message, model);
  };

  const handleSelectChat = (chat: Chat) => {
    setCurrentChat(chat);
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    await deleteChat(chatId);
  };

  return (
    <div className="flex flex-col w-[260px] h-[calc(100vh-64px)] bg-gray-50 border-r">
      <div className="flex-shrink-0">
        <NewChatButton onNewChat={handleNewChat} disabled={isLoading} />
        {error && (
          <div className="px-4 mb-4">
            <ErrorMessage message={error} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat)}
            className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 ${
              currentChat?.id === chat.id ? 'bg-gray-100' : ''
            }`}
          >
            <span className="truncate flex-1">{chat.title}</span>
            <button
              onClick={(e) => handleDeleteChat(e, chat.id)}
              className="p-1 rounded hover:bg-gray-200"
            >
              <TrashIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 