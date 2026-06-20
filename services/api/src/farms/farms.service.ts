import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.farm.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const farm = await this.prisma.farm.findFirst({
      where: { id, userId },
      include: {
        satelliteData: { orderBy: { capturedAt: 'desc' }, take: 1 },
        weatherData: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    });
    if (!farm) throw new NotFoundException('مزرعه یافت نشد');
    return farm;
  }

  async create(data: {
    userId: string;
    name: string;
    province?: string;
    city?: string;
    areaHa?: number;
    soilType?: string;
    cropDate?: string;
    waterSource?: string;
    irrigationType?: string;
    geojson?: any;
  }) {
    return this.prisma.farm.create({
      data: {
        userId: data.userId,
        name: data.name,
        product: 'گندم',
        province: data.province,
        city: data.city,
        areaHa: data.areaHa,
        soilType: data.soilType,
        cropDate: data.cropDate ? new Date(data.cropDate) : undefined,
        waterSource: data.waterSource as any,
        irrigationType: data.irrigationType as any,
        geojson: data.geojson || undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    const farm = await this.findOne(id, userId);
    await this.prisma.farm.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'مزرعه حذف شد' };
  }
}
