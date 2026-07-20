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
