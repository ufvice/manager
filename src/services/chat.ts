import { Message } from '@/types/chat';
import { Model } from '@/types/model';
import { apiService } from './api';

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    delta?: {
      content?: string;
    };
  }>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CHAR_DELAY = 10; // Character delay in ms
const TOKEN_THRESHOLD = 400; // Threshold for slow token detection in ms

async function* characterStreamGenerator(content: string, lastTokenTime: number) {
  const now = Date.now();
  const timeDiff = now - lastTokenTime;

  if (timeDiff > TOKEN_THRESHOLD) {
    // Slow mode: output character by character
    const charInterval = Math.min(Math.max(timeDiff / content.length, CHAR_DELAY), 100);
    for (let i = 0; i < content.length; i++) {
      await new Promise(resolve => setTimeout(resolve, charInterval));
      yield content[i];
    }
  } else {
    // Fast mode: output entire token at once
    yield content;
  }
}

function parseTokens(data: string): string[] {
  const tokens: string[] = [];
  const lines = data.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const content = line.slice(6);
      if (content === '[DONE]') continue;

      try {
        const parsed = JSON.parse(content);
        const token = parsed.choices[0]?.delta?.content || '';
        if (token) tokens.push(token);
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  }

  return tokens;
}

export async function sendChatMessage(
  model: Model,
  messages: Message[],
  onProgress?: (content: string) => void
): Promise<string> {
  try {
    return await apiService.sendChatRequest(model, messages, onProgress);
  } catch (error) {
    console.error('Chat service error:', error);
    throw error;
  }
}