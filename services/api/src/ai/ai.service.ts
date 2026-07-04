import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GeminiProvider } from './providers/gemini.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { OpenRouterProvider } from './providers/openrouter.provider';
import { BaseAiProvider } from './providers/base.provider';
import { ContextBuilder, ExpertiseLevel } from './prompts/context-builder';
import { buildSystemPrompt } from './prompts/system-prompts';
import { LoadBalancer } from './strategies/load-balancer';
import { RateLimiter } from './strategies/rate-limiter';
import { AICache } from './strategies/cache';

@Injectable()
export class AiService {
  private providers: BaseAiProvider[];
  private loadBalancer: LoadBalancer;
  private rateLimiter: RateLimiter;
  private contextBuilder: ContextBuilder;
  private cache: AICache;

  constructor(private prisma: PrismaService) {
    this.providers = [new GeminiProvider(), new DeepSeekProvider(), new OpenRouterProvider()];
    this.loadBalancer = new LoadBalancer(this.providers);
    this.rateLimiter = new RateLimiter(this.prisma);
    this.contextBuilder = new ContextBuilder(this.prisma);
    this.cache = new AICache();
  }

  async chat(userId: string, farmId: string | undefined, message: string, expertiseLevel?: ExpertiseLevel) {
    await this.prisma.aIChat.create({
      data: { userId, farmId: farmId || null, role: 'user', content: message },
    });
    const limit = await this.rateLimiter.checkLimit(userId);
    if (!limit.allowed) {
      const msg = '⚠️ تعداد پیام‌های مجاز امروز شما به پایان رسیده. فردا دوباره تلاش کنید.';
      await this.saveResponse(userId, farmId, msg, 'system', 0, 0);
      return { response: msg, limit: { remaining: 0, limit: limit.limit }, model: 'rate-limited' };
    }
    const { contextStr } = await this.contextBuilder.build(userId, farmId);
    const systemPrompt = buildSystemPrompt(expertiseLevel || 'farmer', contextStr);
    const cacheKey = this.cache.getKey(message, systemPrompt);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      await this.saveResponse(userId, farmId, cached.response, cached.model, 0, 0);
      return { response: cached.response, cached: true, model: cached.model, limit };
    }
    const available = this.loadBalancer.getAvailableProviders();
    let lastError: string | null = null;
    for (const provider of available) {
      try {
        const result = await provider.chat({ message, systemPrompt, temperature: 0.7, maxTokens: 1024 });
        await this.saveResponse(userId, farmId, result.content, result.model, result.tokens, result.latencyMs);
        this.cache.set(cacheKey, result.content, result.model);
        return { response: result.content, model: result.model, tokens: result.tokens, latency: result.latencyMs, limit };
      } catch (err: any) { lastError = err.message || `${provider.name} failed`; continue; }
    }
    const fallbackResp = '⚠️ سرویس هوش مصنوعی موقتاً در دسترس نیست. لطفاً چند دقیقه دیگر تلاش کنید.';
    await this.saveResponse(userId, farmId, fallbackResp, 'fallback', 0, 0);
    return { response: fallbackResp, error: lastError, model: 'fallback', limit };
  }

  async getHistory(userId: string, limit: number = 20) {
    return this.prisma.aIChat.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
  }

  private async saveResponse(userId: string, farmId: string | undefined, content: string, model: string, tokens: number, latencyMs: number) {
    await this.prisma.aIChat.create({ data: { userId, farmId: farmId || null, role: 'ai', content } });
  }
}

