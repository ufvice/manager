import { Message } from '../types/chat';
import { Model } from '../components/models/types';

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

export async function sendChatMessage(model: Model, messages: Message[]): Promise<string> {
  const formattedMessages = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));

  try {
    const response = await fetch(model.apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: formattedMessages
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatCompletionResponse = await response.json();
    if (!data.choices?.[0]) {
      console.error('Can\'t extract response from `data.choices[0].message.content`:', data);
      throw new Error('No response from chat service');
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}