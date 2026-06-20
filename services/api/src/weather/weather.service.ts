import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class WeatherService {
  constructor(private prisma: PrismaService) {}

  async getLatest(farmId: string) {
    return this.prisma.weatherData.findFirst({
      where: { farmId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async getHistory(farmId: string, days: number = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.prisma.weatherData.findMany({
      where: { farmId, recordedAt: { gte: since } },
      orderBy: { recordedAt: 'asc' },
    });
  }
}
