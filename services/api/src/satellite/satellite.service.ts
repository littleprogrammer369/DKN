import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SatelliteService {
  constructor(private prisma: PrismaService) {}

  async getLatest(farmId: string) {
    return this.prisma.satelliteData.findFirst({
      where: { farmId },
      orderBy: { capturedAt: 'desc' },
    });
  }

  async getHistory(farmId: string, days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return this.prisma.satelliteData.findMany({
      where: { farmId, capturedAt: { gte: since } },
      orderBy: { capturedAt: 'asc' },
    });
  }
}
