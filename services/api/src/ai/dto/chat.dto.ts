import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsString()
  farmId?: string;

  @IsOptional()
  @IsString()
  expertiseLevel?: string;
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
