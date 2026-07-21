import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('phone') phone: string,
    @Body('password') password: string,
    @Body('email') email?: string,
    @Body('firstName') firstName?: string,
  ) {
    return this.authService.register({ phone, password, email, firstName });
  }

  @Post('login')
  async login(
    @Body('phone') phone: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(phone, password);
  }

  @Post('send-otp')
  async sendOtp(@Body('phone') phone: string) {
    return this.authService.sendOtp(phone);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Request() req: any, @Body('currentPassword') currentPassword: string, @Body('newPassword') newPassword: string) {
    return this.authService.changePassword(req.user.id, currentPassword, newPassword);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('phone') phone: string, @Body('code') code: string) {
    return this.authService.verifyOtp(phone, code);
  }

  @Post('reset-password')
  async resetPassword(@Body('phone') phone: string, @Body('code') code: string, @Body('password') password: string) {
    return this.authService.resetPassword(phone, code, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
