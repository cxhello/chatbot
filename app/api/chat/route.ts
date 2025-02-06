import { NextResponse } from 'next/server';
import axios from 'axios';

const deepseekApi = axios.create({
  baseURL: 'https://api.deepseek.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

const siliconflowApi = axios.create({
  baseURL: 'https://api.siliconflow.cn/v1',
  headers: {
    'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();
    
    let api = deepseekApi;
    let requestBody: any = {
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    };

    if (model === 'siliconflow-reasoner') {
      if (!process.env.SILICONFLOW_API_KEY) {
        throw new Error('SiliconFlow API key is not configured');
      }
      api = siliconflowApi;
      requestBody = {
        ...requestBody,
        model: 'deepseek-ai/DeepSeek-R1'
      };
    } else {
      if (!process.env.DEEPSEEK_API_KEY) {
        throw new Error('DeepSeek API key is not configured');
      }
      // DeepSeek API 的特殊处理
      if (model === 'deepseek-chat') {
        requestBody = {
          ...requestBody,
          model: 'deepseek-chat',
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          }))
        };
      } else if (model === 'deepseek-reasoner') {
        requestBody = {
          ...requestBody,
          model: 'deepseek-reasoner',
          messages: messages.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        };
      }
    }

    console.log('API Request:', {
      endpoint: api.defaults.baseURL,
      model: requestBody.model,
      messageCount: requestBody.messages.length
    });

    const response = await api.post('/chat/completions', requestBody);

    if (!response.data?.choices?.[0]?.message) {
      throw new Error('Invalid response from API');
    }

    const message = response.data.choices[0].message;
    const reasoning = response.data.choices[0].reasoning_content;

    if (reasoning) {
      console.log('Reasoning Content:', reasoning);
      message.reasoning_content = reasoning;
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('API Error Details:', {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    let errorMessage = 'AI 响应失败，请稍后重试';
    let statusCode = 500;

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        errorMessage = 'API 密钥无效或已过期';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      statusCode = error.response?.status || 500;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
} 