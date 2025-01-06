import axios, { AxiosError } from 'axios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function createChatCompletion(messages: ChatMessage[], model: string) {
  try {
    const response = await axios.post('/api/chat', { messages, model });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
    
    throw new Error('AI 响应失败，请稍后重试');
  }
} 