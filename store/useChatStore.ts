import { create } from 'zustand';
import { Chat, Message, ModelType } from '@/types/chat';
import { createChatCompletion } from '@/lib/api';
import { createChat, getUserChats, addMessageToChat, deleteChat } from '@/lib/db';

interface ChatStore {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
  fetchChats: (userId: string) => Promise<void>;
  startNewChat: (userId: string, message: string, model: ModelType) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setCurrentChat: (chat: Chat | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChat: null,
  isLoading: false,
  error: null,

  fetchChats: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const chats = await getUserChats(userId);
      set({ chats });
    } catch (error) {
      set({ error: '获取聊天记录失败' });
    } finally {
      set({ isLoading: false });
    }
  },

  startNewChat: async (userId: string, message: string, model: ModelType) => {
    try {
      set({ isLoading: true, error: null });
      
      // 创建聊天并添加用户的第一条消息
      const chat = await createChat(userId, message, model);
      
      // 获取AI响应
      const aiResponse = await createChatCompletion([
        { role: 'user', content: message }
      ], model);

      // 添加AI响应到聊天
      const assistantMessage = await addMessageToChat(chat.id, {
        role: 'assistant',
        content: aiResponse.content,
        timestamp: Date.now()
      });

      // 更新状态，包括AI的响应消息
      const updatedChat = {
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: assistantMessage.id,
            role: 'assistant',
            content: aiResponse.content,
            timestamp: Date.now()
          }
        ]
      };

      // 更新状态
      set((state) => ({
        chats: [updatedChat, ...state.chats],
        currentChat: updatedChat
      }));
    } catch (error) {
      console.error('Create chat error:', error);
      set({ 
        error: error instanceof Error ? error.message : '创建新对话失败'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (content: string) => {
    const { currentChat } = get();
    if (!currentChat) return;

    try {
      set({ isLoading: true, error: null });
      
      // 添加用户消息
      const userMessage = await addMessageToChat(currentChat.id, {
        role: 'user',
        content,
        timestamp: Date.now()
      });

      // 获取AI响应
      const messages = [...currentChat.messages, userMessage].map(({ role, content }) => ({
        role,
        content
      }));
      
      const aiResponse = await createChatCompletion(messages, currentChat.model);

      // 添加AI响应
      const assistantMessage = await addMessageToChat(currentChat.id, {
        role: 'assistant',
        content: aiResponse.content,
        timestamp: Date.now()
      });

      // 更新状态
      set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: [...chat.messages, userMessage, assistantMessage]
              }
            : chat
        ),
        currentChat: {
          ...currentChat,
          messages: [...currentChat.messages, userMessage, assistantMessage]
        }
      }));
    } catch (error) {
      console.error('Send message error:', error);
      set({ 
        error: error instanceof Error ? error.message : '发送消息失败，请稍后重试'
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      set({ isLoading: true, error: null });
      await deleteChat(chatId);
      set((state) => ({
        chats: state.chats.filter(chat => chat.id !== chatId),
        currentChat: state.currentChat?.id === chatId ? null : state.currentChat
      }));
    } catch (error) {
      set({ error: '删除对话失败' });
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentChat: (chat: Chat | null) => {
    set({ currentChat: chat });
  },

  reset: () => {
    set({
      chats: [],
      currentChat: null,
      isLoading: false,
      error: null
    });
  }
})); 