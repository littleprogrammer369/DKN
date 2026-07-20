export class ChatDto {
  message: string;
  farmId?: string;
  expertiseLevel?: 'simple' | 'farmer' | 'expert' | 'engineer';
}

export class ChatResponseDto {
  id: string;
  role: 'assistant';
  content: string;
  metadata: {
    model: string;
    tokens: number;
    latencyMs: number;
    cached?: boolean;
    expertiseLevel: string;
  };
  conversationId: string;
  timestamp: string;
}
