import { BaseAiProvider, ChatOptions, ChatResult } from './base.provider';

export class GeminiProvider extends BaseAiProvider {
  name = 'gemini';
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async chat(options: ChatOptions): Promise<ChatResult> {
    const start = Date.now();
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: options.message }] }],
          systemInstruction: options.systemPrompt ? { parts: [{ text: options.systemPrompt }] } : undefined,
          generationConfig: { temperature: options.temperature ?? 0.7, maxOutputTokens: options.maxTokens ?? 1024 },
        }),
      }
    );
    const data = await res.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'پاسخی دریافت نشد';
    return { content, model: 'gemini-2.0-flash', tokens: data?.usageMetadata?.totalTokenCount || 0, latencyMs: Date.now() - start };
  }
}
