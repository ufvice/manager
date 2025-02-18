import { ApiConfig, ApiEndpoint, Model } from '@/types/model';
import { Message } from '@/types/chat';
import { useConfigStore } from '@/store/configStore';

export class ApiService {
  private getEndpointUrl(baseUrl: string, endpoint: ApiEndpoint): string {
    // Remove trailing slash if present
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    // If URL ends with #, use it as is
    if (cleanBaseUrl.endsWith('#')) {
      return cleanBaseUrl.slice(0, -1);
    }

    // Check if the URL already contains /v1/
    if (cleanBaseUrl.includes('/v1/')) {
      return `${cleanBaseUrl}/${endpoint}`;
    }

    // Add /v1/ prefix
    return `${cleanBaseUrl}/v1/${endpoint}`;
  }

  private createHeaders(config: ApiConfig): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    });

    if (config.organizationId) {
      headers.set('OpenAI-Organization', config.organizationId);
    }

    if (config.projectId) {
      headers.set('OpenAI-Project', config.projectId);
    }

    return headers;
  }

  public async sendChatRequest(
    model: Model,
    messages: Message[],
    onProgress?: (content: string) => void
  ): Promise<string> {
    const url = this.getEndpointUrl(model.apiConfig.baseUrl, model.endpoint);
    const headers = this.createHeaders(model.apiConfig);

    const config = useConfigStore.getState();
    const shouldStream = model.parameters.overrideGlobal
      ? model.parameters.streamingEnabled
      : config.streamResponses;

    const baseBody = {
      model: model.modelId,
      messages: [
        {
          role: 'system',
          content: config.systemInstruction
        },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ],
      stream: shouldStream && model.streamingSupported,
      temperature: model.parameters.temperature,
      presence_penalty: model.parameters.presencePenalty,
      frequency_penalty: model.parameters.frequencyPenalty,
      top_p: model.parameters.topP,
      max_tokens: model.parameters.maxTokens,
      ...model.parameters.bodyParams
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(baseBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      if (shouldStream && model.streamingSupported) {
        return this.handleStreamingResponse(response, onProgress);
      }

      // 修改非流式响应处理
      try {
        const data = await response.json();
        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format');
        }
        const content = data.choices[0].message.content;
        // 确保通过 onProgress 回调通知 UI 更新
        onProgress?.(content);
        return content;
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Failed to parse API response');
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async handleStreamingResponse(
    response: Response,
    onProgress?: (content: string) => void
  ): Promise<string> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    if (!reader) throw new Error('No reader available');

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onProgress?.(fullContent);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete JSON
              continue;
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer) {
        const lines = buffer.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line.length > 6) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onProgress?.(fullContent);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete JSON
            }
          }
        }
      }

      return fullContent;
    } finally {
      reader.releaseLock();
    }
  }
}

export const apiService = new ApiService();