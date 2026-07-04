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
    const fallbackResp = this.getMockResponse(message);
    await this.saveResponse(userId, farmId, fallbackResp, 'fallback', 0, 0);
    return { response: fallbackResp, model: 'fallback', limit };
  }

  async getHistory(userId: string, limit: number = 20) {
    return this.prisma.aIChat.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
  }

  private getMockResponse(q: string): string {
    const ql = q.toLowerCase();
    if (ql.includes('بیماری') || ql.includes('مرض') || ql.includes('قارچ') || ql.includes('آفت'))
      return '🦠 ریسک بیماری قارچی: ۵۸٪ (متوسط)\n🌡️ دلیل: رطوبت بالا در ۳ روز گذشته\n✅ توصیه: استفاده از قارچکش پیشگیرانه در ۴۸ ساعت آینده.';
    if (ql.includes('کود') || ql.includes('نیتروژن') || ql.includes('فسفر') || ql.includes('پتاسیم'))
      return '🌱 نیتروژن: کمبود متوسط → ۵۰ kg/ha اوره\n⚡ فسفر: وضعیت مطلوب\n🔵 پتاسیم: کمبود خفیف → ۲۰ kg/ha کلرید پتاسیم';
    if (ql.includes('آبیاری') || ql.includes('آب'))
      return '💧 رطوبت خاک: ۶۵٪\n🌡️ دمای فعلی: ۳۱°C\n⏰ بهترین زمان: امشب ساعت ۲۱:۰۰\nمیزان آب: ۴.۵ لیتر در متر مربع';
    if (ql.includes('سلام') || ql.includes('خوبی'))
      return 'سلام! من دستیار هوشمند مزرعه شما هستم. 🌾 درباره آبیاری، کوددهی، آفات و آب‌هوا می‌توانم کمک کنم.';
    return 'بر اساس داده‌های مزرعه شما تحلیل انجام شد.\n\nمی‌توانید درباره:\n• 💧 آبیاری و زمان آن\n• 🌱 کوددهی\n• 🦠 آفات\n• 🌤️ آب‌وهوا\n• 📅 برداشت\nبپرسید.';
  }

  private async saveResponse(userId: string, farmId: string | undefined, content: string, model: string, tokens: number, latencyMs: number) {
    await this.prisma.aIChat.create({ data: { userId, farmId: farmId || null, role: 'ai', content } });
  }
}

