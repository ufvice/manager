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
      console.log('Starting streaming response');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6);

            if (data === '[DONE]') continue;

            try {
              console.log('Parsing SSE data:', data);
              const parsed: ChatCompletionResponse = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              fullContent += content;
              onProgress?.(fullContent);
            } catch (e) {
              console.error('Error parsing SSE message:', e, 'Raw data:', data);
              continue;
            }
          }
        }
      }

      if (buffer.trim()) {
        const trimmedBuffer = buffer.trim();
        if (trimmedBuffer.startsWith('data: ') && trimmedBuffer !== 'data: [DONE]') {
          try {
            const data = trimmedBuffer.slice(6);
            const parsed: ChatCompletionResponse = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            fullContent += content;
            onProgress?.(fullContent);
          } catch (e) {
            console.error('Error parsing final buffer:', e);
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