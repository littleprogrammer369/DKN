import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async chat(userId: string, farmId: string | undefined, message: string) {
    // Save user message
    await this.prisma.aIChat.create({
      data: { userId, farmId: farmId || null, role: 'user', content: message },
    });

    // Simple AI response logic (replace with Gemini/DeepSeek later)
    const response = this.getSimpleResponse(message);

    // Save AI response
    await this.prisma.aIChat.create({
      data: { userId, farmId: farmId || null, role: 'ai', content: response },
    });

    return { response };
  }

  async getHistory(userId: string, limit: number = 20) {
    return this.prisma.aIChat.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private getSimpleResponse(q: string): string {
    const ql = q.toLowerCase();
    if (ql.includes('بیماری') || ql.includes('مرض') || ql.includes('قارچ'))
      return '🦠 ریسک بیماری قارچی: ۵۸٪ (متوسط)\n🌡️ دلیل: رطوبت بالا در ۳ روز گذشته\n✅ توصیه: استفاده از قارچکش پیشگیرانه در ۴۸ ساعت آینده.';
    if (ql.includes('کود') || ql.includes('نیتروژن') || ql.includes('فسفر'))
      return '🌱 نیتروژن: کمبود متوسط → ۵۰ kg/ha اوره\n⚡ فسفر: وضعیت مطلوب\n🔵 پتاسیم: کمبود خفیف → ۲۰ kg/ha کلرید پتاسیم';
    if (ql.includes('ndvi') || ql.includes('ماهواره') || ql.includes('سلامت'))
      return '📊 میانگین NDVI: 0.82 (وضعیت عالی)\n🟢 ۸۲٪ مزرعه در وضعیت سالم';
    if (ql.includes('برداشت'))
      return '📅 تاریخ تقریبی برداشت: ۳۵ روز دیگر\n💧 نیاز آبیاری: ۲ بار دیگر';
    if (ql.includes('آبیاری') || ql.includes('آب'))
      return '💧 رطوبت خاک: ۶۵٪\n🌡️ دمای فعلی: ۳۱°C\n⏰ بهترین زمان: امشب ساعت ۲۱:۰۰\nمیزان آب: ۴.۵ لیتر در متر مربع';
    return 'بر اساس داده‌های مزرعه شما تحلیل انجام شد. سؤال خود را مشخص‌تر بپرسید.';
  }
}
