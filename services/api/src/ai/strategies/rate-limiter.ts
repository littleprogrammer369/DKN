import { PrismaService } from '../../prisma.service';

const PLAN_LIMITS: Record<string, number> = {
  FREE: 10,
  BASIC: 50,
  PRO: 200,
  ENTERPRISE: 1000,
};

export class RateLimiter {
  constructor(private prisma: PrismaService) {}

  async checkLimit(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
    const limit = PLAN_LIMITS[user?.plan || 'FREE'] || 10;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await this.prisma.aIChat.count({
      where: { userId, role: 'user', createdAt: { gte: today } },
    });

    return { allowed: count < limit, remaining: Math.max(0, limit - count), limit };
  }
}
