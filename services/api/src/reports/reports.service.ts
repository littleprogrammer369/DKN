import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getFarmReport(farmId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    const [satellite, weather, irrigations, pests] = await Promise.all([
      this.prisma.satelliteData.findMany({ where: { farmId }, orderBy: { capturedAt: 'desc' }, take: 10 }),
      this.prisma.weatherData.findMany({ where: { farmId }, orderBy: { recordedAt: 'desc' }, take: 7 }),
      this.prisma.irrigationRecord.findMany({ where: { farmId }, orderBy: { appliedAt: 'desc' }, take: 10 }),
      this.prisma.pestReport.findMany({ where: { farmId, isActive: true } }),
    ]);

    const avgNdvi = satellite.length ? satellite.reduce((s, d) => s + (d.ndvi || 0), 0) / satellite.length : 0;

    return {
      farmName: farm?.name,
      period: '30 روز گذشته',
      avgNdvi: Math.round(avgNdvi * 100) / 100,
      healthScore: Math.round(avgNdvi * 100),
      totalIrrigations: irrigations.length,
      totalWaterUsed: irrigations.reduce((s, i) => s + (i.amount || 0), 0),
      activeThreats: pests.length,
      recommendations: [
        avgNdvi > 0.7 ? 'وضعیت مزرعه عالی است. ادامه دهید.' : 'نیاز به توجه بیشتر به پوشش گیاهی.',
        pests.length > 0 ? `${pests.length} تهدید فعال وجود دارد.` : 'هیچ تهدید فعالی شناسایی نشد.',
        'آبیاری بعدی: امشب ساعت ۲۱:۰۰',
      ],
    };
  }
}
