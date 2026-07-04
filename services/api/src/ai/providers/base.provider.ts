export interface ChatOptions {
  message: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResult {
  content: string;
  model: string;
  tokens: number;
  latencyMs: number;
}

export abstract class BaseAiProvider {
  abstract name: string;
  abstract isAvailable(): boolean;
  abstract chat(options: ChatOptions): Promise<ChatResult>;
}
