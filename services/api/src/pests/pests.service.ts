import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PestsService {
  constructor(private prisma: PrismaService) {}

  async getActiveThreats(farmId: string) {
    return this.prisma.pestReport.findMany({
      where: { farmId, isActive: true },
      orderBy: { detectedAt: 'desc' },
    });
  }

  async getRiskLevel(farmId: string) {
    const threats = await this.prisma.pestReport.findMany({
      where: { farmId, isActive: true },
    });

    const pestRisk = threats.filter(t => t.pestType === 'آفت').length * 15;
    const diseaseRisk = threats.filter(t => t.pestType === 'بیماری').length * 20;
    const weedRisk = threats.filter(t => t.pestType === 'علف هرز').length * 10;

    return {
      pestRisk: Math.min(pestRisk, 100),
      diseaseRisk: Math.min(diseaseRisk, 100),
      weedRisk: Math.min(weedRisk, 100),
      activeThreats: threats.length,
    };
  }
}
