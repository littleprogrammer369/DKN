import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class IrrigationService {
  constructor(private prisma: PrismaService) {}

  async getRecommendation(farmId: string) {
    const weather = await this.prisma.weatherData.findFirst({
      where: { farmId },
      orderBy: { recordedAt: 'desc' },
    });

    return {
      recommendedAt: '21:00',
      duration: 45,
      amount: 4.5,
      confidence: 92,
      method: 'DRIP',
      soilMoisture: weather?.soilMoisture || 65,
      temperature: weather?.temperature || 31,
    };
  }

  async logAction(farmId: string, userId: string, data: { amount: number; duration: number; method?: string }) {
    return this.prisma.irrigationRecord.create({
      data: {
        farmId,
        userId,
        amount: data.amount,
        duration: data.duration,
        method: data.method as any,
        isApplied: true,
        appliedAt: new Date(),
      },
    });
  }

  async getHistory(farmId: string) {
    return this.prisma.irrigationRecord.findMany({
      where: { farmId },
      orderBy: { scheduledAt: 'desc' },
      take: 10,
    });
  }
}
