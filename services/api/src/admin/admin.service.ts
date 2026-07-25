import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [totalUsers, totalFarms, openSupportChats, totalPestReports, totalIrrigationRecords] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.farm.count(),
        this.prisma.supportConversation.count({ where: { status: 'OPEN' } }),
        this.prisma.pestReport.count(),
        this.prisma.irrigationRecord.count(),
      ]);

    return {
      totalUsers,
      totalFarms,
      openSupportChats,
      totalPestReports,
      totalIrrigationRecords,
    };
  }

  async users(search?: string, page = 1, limit = 20) {
    const where: any = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } as any },
            { lastName: { contains: search, mode: 'insensitive' } as any },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          role: true,
          plan: true,
          createdAt: true,
          _count: { select: { farms: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: items.map((u) => ({ ...u, farmsCount: u._count.farms })),
      total,
      page,
      limit,
    };
  }

  async userDetail(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        plan: true,
        createdAt: true,
        farms: {
          select: {
            id: true,
            name: true,
            product: true,
            province: true,
            city: true,
            areaHa: true,
            createdAt: true,
          },
        },
        pestReports: {
          select: {
            id: true,
            pestName: true,
            severity: true,
            detectedAt: true,
            farmId: true,
          },
          orderBy: { detectedAt: 'desc' },
          take: 5,
        },
        irrigationRecs: {
          select: {
            id: true,
            amount: true,
            scheduledAt: true,
            farmId: true,
          },
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
        subscriptions: {
          select: {
            id: true,
            plan: true,
            startDate: true,
            endDate: true,
            isActive: true,
            paymentStatus: true,
          },
          orderBy: { startDate: 'desc' },
          take: 5,
        },
        _count: { select: { farms: true, pestReports: true, irrigationRecs: true } },
      },
    });

    if (!user) return null;

    return {
      ...user,
      farmsCount: user._count.farms,
      pestReportsCount: user._count.pestReports,
      irrigationRecsCount: user._count.irrigationRecs,
    };
  }

  async supportConversations(userId?: string, status?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return this.prisma.supportConversation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async supportMessages(conversationId: string) {
    return this.prisma.supportMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        conversation: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async sendAdminMessage(conversationId: string, adminId: string, text: string) {
    const conversation = await this.prisma.supportConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new BadRequestException('مکالمه یافت نشد');
    }

    const message = await this.prisma.supportMessage.create({
      data: {
        conversationId,
        senderId: adminId,
        senderRole: 'admin',
        text,
      },
    });

    await this.prisma.supportConversation.update({
      where: { id: conversationId },
      data: { status: 'PENDING', lastMessageAt: new Date() },
    });

    return message;
  }

  async updateConversationStatus(conversationId: string, status: string) {
    return this.prisma.supportConversation.update({
      where: { id: conversationId },
      data: { status },
    });
  }

  async landingContent() {
    const settings = await this.prisma.appSetting.findMany({
      where: { key: { startsWith: 'landing.' } },
    });

    const map: Record<string, any> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    const defaults = {
      'landing.heroTitle': 'داده کشت نوین',
      'landing.heroSubtitle': 'هوش مصنوعی در خدمت کشاورزی',
      'landing.aboutUs':
        'داده کشت نوین با ترکیب داده‌های ماهواره‌ای، هواشناسی و هوش مصنوعی، کشاورزان و شرکت‌های کشاورزی را به تصمیم‌گیری بهتر کمک می‌کند.',
      'landing.supportPhone': '۰۲۱-۱۲۳۴۵۶۷۸',
      'landing.supportEmail': 'support@dkn.ir',
    };

    return { ...defaults, ...map };
  }

  async updateLandingContent(data: Record<string, any>) {
    const keys = Object.keys(data);
    const existing = await this.prisma.appSetting.findMany({
      where: { key: { in: keys } },
    });

    const existingKeys = new Set(existing.map((s) => s.key));

    for (const [key, value] of Object.entries(data)) {
      if (existingKeys.has(key)) {
        await this.prisma.appSetting.update({
          where: { key },
          data: { value },
        });
      } else {
        await this.prisma.appSetting.create({
          data: { key, value },
        });
      }
    }

    return this.landingContent();
  }
}
