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
      const msg = '️ تعداد پیام‌های مجاز امروز شما به پایان رسیده. فردا دوباره تلاش کنید.';
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
    console.log(`[AI] Available providers: ${available.map(p => p.name).join(', ')}`);
    console.log(`[AI] All providers: ${this.providers.map(p => `${p.name}: ${p.isAvailable()}`).join(', ')}`);
    let lastError: string | null = null;
    for (const provider of available) {
      try {
        console.log(`[AI] Trying provider: ${provider.name}`);
        const result = await provider.chat({ message, systemPrompt, temperature: 0.7, maxTokens: 1024 });
        console.log(`[AI] ✓ ${provider.name} responded (${result.latencyMs}ms)`);
        await this.saveResponse(userId, farmId, result.content, result.model, result.tokens, result.latencyMs);
        this.cache.set(cacheKey, result.content, result.model);
        return { response: result.content, model: result.model, tokens: result.tokens, latency: result.latencyMs, limit };
      } catch (err: any) {
        lastError = `${provider.name}: ${err.message || 'unknown error'}`;
        console.log(`[AI] ✗ ${provider.name} failed: ${err.message}`);
        continue;
      }
    }
    console.log(`[AI] All providers failed. Last error: ${lastError}. Using fallback.`);
    const fallbackResp = this.getMockResponse(message);
    await this.saveResponse(userId, farmId, fallbackResp, 'fallback', 0, 0);
    return { response: fallbackResp, model: 'fallback', limit };
  }

  async getHistory(userId: string, limit: number = 20) {
    return this.prisma.aIChat.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
  }

  async clearHistory(userId: string) {
    await this.prisma.aIChat.deleteMany({ where: { userId } });
    return { message: 'تاریخچه با موفقیت پاک شد' };
  }

  private getMockResponse(q: string): string {
    const msg = q.toLowerCase();
    if (msg.includes('سلام') || msg.includes('درود') || msg.includes('خوبی'))
      return ' **سلام! به داده کشت نوین خوش آمدید.**\n\nمن دستیار هوشمند کشاورزی هستم. می‌توانم درباره:\n•  آبیاری\n•  کوددهی\n•  آفات و بیماری‌ها\n• ️ آب و هوا\n•  برداشت\n• ️ تصاویر ماهواره\n\nسوال خود را بپرسید!';
    if (msg.includes('آبیاری') || msg.includes('آب'))
      return ' **برنامه آبیاری گندم**\n\n جوانه‌زنی: هر ۱۰-۱۵ روز، ۲۵-۳۰mm\n پنجه‌زنی: هر ۱۵-۲۰ روز، ۵۰-۶۰mm\n ساقه‌دهی: هر ۱۲-۱۵ روز، ۶۰-۷۰mm\n گل‌دهی: هر ۸-۱۰ روز، ۵۰-۶۰mm\n پرشدن دانه: هر ۱۲-۱۵ روز، ۴۰-۵۰mm\n\nمجموع: ۲۵۰-۳۵۰mm در فصل\n بهترین زمان: صبح زود یا غروب';
    if (msg.includes('آفت') || msg.includes('بیماری') || msg.includes('قارچ') || msg.includes('زنگ'))
      return ' **راهنمای آفات گندم**\n\n زنگ زرد: تریادیمنول\n سفیدک پودری: گوگرد\n شته: پیمتروزین\n\n پیشگیری: ارقام مقاوم، تناوب ۳ ساله';
    if (msg.includes('کود') || msg.includes('نیتروژن') || msg.includes('فسفر') || msg.includes('اوره'))
      return ' **برنامه کوددهی**\n\nN=۱۲۰-۱۵۰ | P=۶۰-۸۰ | K=۷۵-۱۰۰ kg/ha\n\nنوبت۱ (پیش کاشت): فسفره + پتاسه\nنوبت۲ (پنجه‌زنی): اوره ۱۰۰kg\nنوبت۳ (ساقه‌دهی): اوره ۵۰kg\nنوبت۴ (گل‌دهی): محلول‌پاشی';
    if (msg.includes('هوا') || msg.includes('دما') || msg.includes('باران') || msg.includes('بارش'))
      return '️ **پیش‌بینی ۵ روزه**\n\nامروز: ️ ۳۲°/۲۲° ️۵٪\nفردا:  ۳۰°/۲۰° ️۲۰٪\nروز۳: ️ ۲۸°/۱۹° ️۴۰٪\nروز۴: ️ ۲۶°/۱۸° ️۶۵٪\nروز۵: ️ ۲۹°/۲۰° ️۱۵٪';
    if (msg.includes('برداشت') || msg.includes('درو'))
      return ' **برداشت گندم**\n\n حدود ۳۵ روز دیگر (اوایل تیر)\n نشانه: زردی ۹۰٪ خوشه‌ها\n قطع آبیاری ۱۰-۱۴ روز قبل\n انبار: رطوبت <۱۲٪، دمای ۱۵-۲۰°C';
    if (msg.includes('ndvi') || msg.includes('ماهواره') || msg.includes('سلامت'))
      return '️ **NDVI مزرعه: ۰.۸۲ **\n\n >0.7 عالی\n 0.5-0.7 خوب\n 0.3-0.5 متوسط\n <0.3 ضعیف\n\n۸۲٪ سطح مزرعه سالم';
    if (msg.includes('خاک') || msg.includes('اصلاح'))
      return ' **مدیریت خاک**\n\npH مطلوب: ۶.۵-۷.۵\nEC: <4 dS/m\nماده آلی: >۱.۵٪\n\nاصلاح: کود دامی ۲۰-۳۰تن/ha';
    if (msg.includes('گندم') || msg.includes('کشت'))
      return ' **کشت گندم (ساوه)**\n\n کاشت: آبان | برداشت: تیر\n عمق: ۳-۵cm | بذر: ۱۶۰-۱۸۰kg/ha\n ارقام: پیشگام، پیشتاز، چمران۲';
    if (msg.includes('راهنما') || msg.includes('help'))
      return ' **می‌توانید بپرسید:**\n زمان آبیاری\n برنامه کوددهی\n کنترل آفات\n️ پیش‌بینی هوا\n زمان برداشت';
    return ' **سؤال شناسایی نشد.**\n\nلطفاً بپرسید:\n "آبیاری"\n "کوددهی"\n "آفات"\n️ "پیش‌بینی هوا"\n "برداشت"\n "کشت گندم"';
  }


  private async saveResponse(userId: string, farmId: string | undefined, content: string, model: string, tokens: number, latencyMs: number) {
    await this.prisma.aIChat.create({ data: { userId, farmId: farmId || null, role: 'ai', content } });
  }
}

