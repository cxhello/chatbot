export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  reasoning_content?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  userId: string;
  model: string;
}

export const AVAILABLE_MODELS = {
  'deepseek-chat': 'DeepSeek-V3',
  'deepseek-reasoner': 'DeepSeek-R1',
  'siliconflow-reasoner': 'SiliconFlow-DeepSeek-R1',
  // 'deepseek-coder': '敬请期待...',  // 注释掉暂未开放的模型
} as const;

export type ModelType = keyof typeof AVAILABLE_MODELS;

export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
} 