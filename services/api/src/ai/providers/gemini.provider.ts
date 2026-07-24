import { BaseAiProvider, ChatOptions, ChatResult } from './base.provider';

export class GeminiProvider extends BaseAiProvider {
  name = 'gemini';
  private getKey() { return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_KEY || ''; }
  private getModel() { return process.env.GEMINI_MODEL || 'gemini-2.0-flash'; }
  isAvailable(): boolean { return !!this.getKey(); }

  async chat(options: ChatOptions): Promise<ChatResult> {
    const key = this.getKey();
    if (!key) throw new Error('GEMINI_API_KEY تنظیم نشده');
    const model = this.getModel();
    const start = Date.now();
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: options.message }] }],
        systemInstruction: options.systemPrompt ? { parts: [{ text: options.systemPrompt }] } : undefined,
        generationConfig: { temperature: options.temperature ?? 0.7, maxOutputTokens: options.maxTokens ?? 1024 },
      }),
    });
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Gemini: پاسخ خالی');
    return { content, model, tokens: data?.usageMetadata?.totalTokenCount || 0, latencyMs: Date.now() - start };
  }
}
