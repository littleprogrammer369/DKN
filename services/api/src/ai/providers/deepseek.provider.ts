import { BaseAiProvider, ChatOptions, ChatResult } from './base.provider';

export class DeepSeekProvider extends BaseAiProvider {
  name = 'deepseek';
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async chat(options: ChatOptions): Promise<ChatResult> {
    const start = Date.now();
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          ...(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
          { role: 'user', content: options.message },
        ],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1024,
      }),
    });
    if (!res.ok) throw new Error(`DeepSeek HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('DeepSeek: پاسخ خالی دریافت شد');
    return { content, model: 'deepseek-chat', tokens: data?.usage?.total_tokens || 0, latencyMs: Date.now() - start };
  }
}
