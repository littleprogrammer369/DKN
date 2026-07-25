import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as { id: string; phone: string; role: string } | undefined;

    if (!user) {
      throw new ForbiddenException('شما دسترسی مدیریت ندارید.');
    }

    if (user.role === 'ADMIN') {
      return true;
    }

    const adminPhones = (process.env.ADMIN_PHONE_NUMBERS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const adminUserIds = (process.env.ADMIN_USER_IDS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const isAdminByEnv =
      adminPhones.includes(user.phone) || adminUserIds.includes(user.id);

    if (!isAdminByEnv) {
      throw new ForbiddenException('شما دسترسی مدیریت ندارید.');
    }

    return true;
  }
}
