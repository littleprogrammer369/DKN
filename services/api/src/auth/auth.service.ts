import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register new user
  async register(dto: { phone: string; password: string; email?: string; firstName?: string }) {
    // Check if phone already exists
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('این شماره قبلاً ثبت شده است');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          passwordHash,
          email: dto.email || null,
          firstName: dto.firstName || null,
          isVerified: true,
        },
      });
      return this.generateTokens(user);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('این شماره قبلاً ثبت شده است');
      }
      throw error;
    }
  }

  // Login with phone + password
  async login(phone: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new BadRequestException('شماره تلفن یا رمز عبور اشتباه است');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('این حساب از طریق رمز عبور قابل ورود نیست');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new BadRequestException('شماره تلفن یا رمز عبور اشتباه است');
    }

    return this.generateTokens(user);
  }

  // Generate JWT tokens
  private generateTokens(user: any) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        plan: user.plan,
      },
    };
  }

  // Change password (authenticated user)
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('کاربر یافت نشد');

    if (!user.passwordHash) {
      throw new BadRequestException('این حساب رمز عبور ندارد');
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('رمز عبور فعلی اشتباه است');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'رمز عبور با موفقیت تغییر کرد' };
  }

  // Send OTP code (for forgot-password)
  async sendOtp(phone: string) {
    // Check user exists
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new BadRequestException('کاربری با این شماره پیدا نشد');
    }

    // Generate 5-digit code
    const code = String(Math.floor(10000 + Math.random() * 90000));

    // Store in DB
    const otp = await this.prisma.otpCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      },
    });

    // Log code (since SMS panel is not purchased yet)
    console.log(`[OTP] Code for ${phone}: ${code} (expires in 5 min)`);

    return {
      message: 'کد تأیید ارسال شد',
      otpId: otp.id,
      // TODO: When SMS panel is added, remove the code from response
      // For now return the code so user can test without SMS
      code: code,
    };
  }

  // Verify OTP code
  async verifyOtp(phone: string, code: string) {
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException('کد نامعتبر یا منقضی شده');
    }

    // Mark as used
    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    });

    return { message: 'کد تأیید شد', verified: true };
  }

  // Reset password after OTP verification
  async resetPassword(phone: string, code: string, newPassword: string) {
    // Verify OTP one more time
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        usedAt: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      // Allow reset if OTP was just verified (verify-otp already marked as used)
      // This catches the case where verify-otp was called right before
      const recentOtp = await this.prisma.otpCode.findFirst({
        where: {
          phone,
          code,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (!recentOtp) {
        throw new BadRequestException('ابتدا کد تأیید را دریافت و تأیید کنید');
      }
      // Mark as used
      await this.prisma.otpCode.update({
        where: { id: recentOtp.id },
        data: { usedAt: new Date() },
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user
    await this.prisma.user.update({
      where: { phone },
      data: { passwordHash },
    });

    return { message: 'رمز عبور با موفقیت تغییر کرد' };
  }

  // Get user profile
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedException('کاربر یافت نشد');
    return user;
  }
}
