import { NextResponse } from 'next/server';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.deepseek.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();
    
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is not configured');
    }

    console.log('API Request:', {
      model,
      messages,
      apiKey: process.env.DEEPSEEK_API_KEY?.slice(0, 8) + '...'
    });

    const response = await api.post('/chat/completions', {
      model: 'deepseek-chat',  // 暂时硬编码模型名称
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (!response.data?.choices?.[0]?.message) {
      throw new Error('Invalid response from DeepSeek API');
    }

    return NextResponse.json(response.data.choices[0].message);
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