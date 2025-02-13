import { Message } from '../types/chat';
import { Model } from '../components/models/types';

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

const CHAR_DELAY = 1; // Character delay in ms
const TOKEN_THRESHOLD = 100; // Threshold for slow token detection in ms

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
  console.log('Chat service model:', model);
  console.log('Chat service parameters:', model.parameters);

  const apiMessages: ChatMessage[] = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
  console.log('Sending messages to API:', JSON.stringify(apiMessages, null, 2));

  const streamingEnabled = model.parameters?.streamingEnabled && model.streamingSupported;
  console.log('Streaming enabled:', streamingEnabled);

  try {
    const response = await fetch(model.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: apiMessages,
        stream: streamingEnabled
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle streaming response
    if (streamingEnabled) {
      let lastTokenTime = Date.now();
      let fullContent = '';
      let buffer = '';
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const tokens = parseTokens(line);
          for (const token of tokens) {
            for await (const char of characterStreamGenerator(token, lastTokenTime)) {
              fullContent += char;
              onProgress?.(fullContent);
            }
            lastTokenTime = Date.now();
          }
        }
      }

      // Handle remaining buffer
      if (buffer) {
        const tokens = parseTokens(buffer);
        for (const token of tokens) {
          for await (const char of characterStreamGenerator(token, lastTokenTime)) {
            fullContent += char;
            onProgress?.(fullContent);
          }
        }
      }

      return fullContent;
    }

    console.log('Streaming response disabled, %s', model.parameters.streamingEnabled);
    // Non-streaming response
    const data: ChatCompletionResponse = await response.json();
    if (!data.choices?.[0]) {
      throw new Error('No response from chat service');
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Chat service error:', error);
    throw error;
  }
}