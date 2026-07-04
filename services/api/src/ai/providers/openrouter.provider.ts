import { BaseAiProvider, ChatOptions, ChatResult } from './base.provider';

export class OpenRouterProvider extends BaseAiProvider {
  name = 'openrouter';
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async chat(options: ChatOptions): Promise<ChatResult> {
    const start = Date.now();
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://dadehkeshtnovin.ir',
        'X-Title': 'Dadeh Kesht Novin',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
          { role: 'user', content: options.message },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1024,
      }),
    });
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || '⚠️ پاسخی دریافت نشد';
    return { content, model: 'meta-llama/llama-3.1-8b-instruct', tokens: data?.usage?.total_tokens || 0, latencyMs: Date.now() - start };
  }
}
