import { PrismaService } from '../../prisma.service';

export type ExpertiseLevel = 'simple' | 'farmer' | 'expert' | 'engineer';

export interface AIContext {
  userName: string;
  farmName?: string;
  crop?: string;
  areaHa?: number;
  location?: string;
  soilType?: string;
  irrigationType?: string;
  temperature?: number;
  humidity?: number;
  lastIrrigation?: string;
  daysSinceLastIrrigation?: number;
}

export class ContextBuilder {
  constructor(private prisma: PrismaService) {}

  async build(userId: string, farmId?: string): Promise<{ contextStr: string; farmName?: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const userName = user?.firstName || 'کاربر';

    if (!farmId) {
      return {
        contextStr: `کاربر: ${userName}\n(مزرعه‌ای انتخاب نشده)`,
      };
    }

    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
      include: {
        weatherData: { orderBy: { recordedAt: 'desc' }, take: 1 },
        irrigationRecs: { where: { isApplied: true }, orderBy: { appliedAt: 'desc' }, take: 1 },
      },
    });

    if (!farm) {
      return { contextStr: `کاربر: ${userName}\n(مزرعه مورد نظر یافت نشد)` };
    }

    const weather = farm.weatherData?.[0];
    const lastIrr = farm.irrigationRecs?.[0];
    const daysSinceIrr = lastIrr?.appliedAt
      ? Math.floor((Date.now() - new Date(lastIrr.appliedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const ctx: AIContext = {
      userName,
      farmName: farm.name,
      crop: farm.product || 'گندم',
      areaHa: farm.areaHa || undefined,
      location: [farm.city, farm.province].filter(Boolean).join('، ') || undefined,
      soilType: farm.soilType || undefined,
      irrigationType: farm.irrigationType || undefined,
      temperature: weather?.temperature || undefined,
      humidity: weather?.humidity || undefined,
      lastIrrigation: lastIrr?.appliedAt ? new Date(lastIrr.appliedAt).toLocaleDateString('fa-IR') : undefined,
      daysSinceLastIrrigation: daysSinceIrr > 0 ? daysSinceIrr : undefined,
    };

    const parts: string[] = [`کاربر: ${ctx.userName}`];
    if (ctx.farmName) parts.push(`مزرعه: ${ctx.farmName}`);
    if (ctx.crop) parts.push(`محصول: ${ctx.crop}`);
    if (ctx.areaHa) parts.push(`مساحت: ${ctx.areaHa} هکتار`);
    if (ctx.location) parts.push(`موقعیت: ${ctx.location}`);
    if (ctx.soilType) parts.push(`نوع خاک: ${ctx.soilType}`);
    if (ctx.irrigationType) parts.push(`آبیاری: ${ctx.irrigationType}`);
    if (ctx.temperature) parts.push(`دمای هوا: ${ctx.temperature}°C`);
    if (ctx.humidity) parts.push(`رطوبت: ${ctx.humidity}%`);
    if (ctx.lastIrrigation) {
      parts.push(`آخرین آبیاری: ${ctx.lastIrrigation}`);
      if (ctx.daysSinceLastIrrigation) parts.push(`${ctx.daysSinceLastIrrigation} روز از آخرین آبیاری گذشته`);
    }

    return { contextStr: parts.join('\n'), farmName: ctx.farmName };
  }
}
