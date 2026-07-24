import { Injectable, OnModuleInit } from '@nestjs/common';
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
export class AiService implements OnModuleInit {
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

  async onModuleInit() {
    const avail = this.loadBalancer.getAvailableProviders().map(p => p.name);
    console.log(`[AI] configured providers: ${avail.join(', ') || 'NONE'}`);
    const gemini = this.providers.find(p => p.name === 'gemini');
    if (gemini?.isAvailable()) {
      try { const r = await gemini.chat({ message: 'ping', temperature: 0, maxTokens: 8 }); console.log(`[AI] Gemini self-test OK (${r.latencyMs}ms)`); }
      catch (e: any) { console.log(`[AI] Gemini self-test FAILED: ${e.message}`); }
    } else {
      console.log('[AI] Gemini NOT configured -> set GEMINI_API_KEY in services/api/.env and restart dkn-api');
    }
  }

  async chat(userId: string, farmId: string | undefined, message: string, expertiseLevel?: ExpertiseLevel) {
    await this.prisma.aIChat.create({ data: { userId, farmId: farmId || null, role: 'user', content: message } });
    const limit = await this.rateLimiter.checkLimit(userId);
    if (!limit.allowed) {
      const msg = '⏳ تعداد پیام‌های مجاز امروز شما به پایان رسیده. فردا دوباره تلاش کنید.';
      await this.saveResponse(userId, farmId, msg, 'rate-limited', 0, 0);
      return { response: msg, model: 'rate-limited', limit: { remaining: 0, limit: limit.limit } };
    }
    const { contextStr } = await this.contextBuilder.build(userId, farmId);
    const systemPrompt = buildSystemPrompt(expertiseLevel || 'farmer', contextStr);
    const cacheKey = this.cache.getKey(message, systemPrompt);
    const cached = this.cache.get(cacheKey);
    if (cached) { await this.saveResponse(userId, farmId, cached.response, cached.model, 0, 0); return { response: cached.response, cached: true, model: cached.model, limit }; }

    const available = this.loadBalancer.getAvailableProviders();
    if (available.length === 0) {
      const offline = process.env.AI_OFFLINE_FALLBACK === 'true';
      const resp = offline ? this.getMockResponse(message)
        : '⚠️ کلید هوش مصنوعی (GEMINI_API_KEY) روی سرور تنظیم نشده است. لطفاً کلید رایگان خود را از aistudio.google.com بگیرید، در فایل services/api/.env قرار دهید و سرویس API را ری‌استارت کنید.';
      await this.saveResponse(userId, farmId, resp, offline ? 'offline' : 'config-error', 0, 0);
      return { response: resp, model: offline ? 'offline' : 'config-error', limit };
    }

    let lastError: string | null = null;
    for (const provider of available) {
      try {
        const result = await provider.chat({ message, systemPrompt, temperature: 0.7, maxTokens: 1024 });
        await this.saveResponse(userId, farmId, result.content, result.model, result.tokens, result.latencyMs);
        this.cache.set(cacheKey, result.content, result.model);
        return { response: result.content, model: result.model, tokens: result.tokens, latency: result.latencyMs, limit };
      } catch (err: any) { lastError = `${provider.name}: ${err.message || 'unknown'}`; console.log(`[AI] ✗ ${provider.name}: ${err.message}`); }
    }
    console.log(`[AI] all providers failed: ${lastError}`);
    const offline = process.env.AI_OFFLINE_FALLBACK === 'true';
    const resp = offline ? this.getMockResponse(message)
      : '⚠️ در حال حاضر نتوانستم به سرویس هوش مصنوعی متصل شوم. لطفاً بعداً دوباره تلاش کنید. (جزئیات خطا در لاگ سرور ثبت شد — دسترسی به generativelanguage.googleapis.com و اعتبار کلید Gemini را بررسی کنید.)';
    await this.saveResponse(userId, farmId, resp, 'fallback', 0, 0);
    return { response: resp, model: 'fallback', error: lastError, limit };
  }

  async getHistory(userId: string, limit = 20) { return this.prisma.aIChat.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit }); }
  async clearHistory(userId: string) { await this.prisma.aIChat.deleteMany({ where: { userId } }); return { message: 'تاریخچه با موفقیت پاک شد' }; }

  private getMockResponse(q: string): string {
    const m = q.toLowerCase();
    if (m.includes('آبیاری') || m.includes('آب')) return '**برنامه آبیاری:** بر اساس داده‌های موجود، وضعیت رطوبت را بررسی و در صورت خشکی آبیاری سبک انجام دهید.';
    if (m.includes('آفت') || m.includes('بیماری')) return '**پایش آفات:** علائم برگ‌ها را بررسی کنید؛ در صورت مشاهده لکه یا شته، نمونه را ثبت کنید تا توصیه دقیق بدهم.';
    return 'سلام! من در حالت آفلاین هستم. لطفاً کلید Gemini را تنظیم کنید تا پاسخ هوشمند بدهم.';
  }
  private async saveResponse(userId: string, farmId: string | undefined, content: string, model: string, tokens: number, latencyMs: number) {
    await this.prisma.aIChat.create({ data: { userId, farmId: farmId || null, role: 'ai', content } });
  }
}
