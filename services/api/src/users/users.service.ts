import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, data: { firstName?: string; lastName?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, phone: true, firstName: true, lastName: true, email: true, role: true, plan: true, avatar: true },
    });
  }

  async updateAvatar(userId: string, avatar: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: { id: true, avatar: true },
    });
  }

  async deleteAccount(userId: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('کاربر یافت نشد');

    if (user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) throw new BadRequestException('رمز عبور اشتباه است');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'حساب کاربری با موفقیت حذف شد' };
  }
}
