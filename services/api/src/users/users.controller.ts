import { Controller, Put, Post, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('profile')
  updateProfile(@Body() body: { firstName?: string; lastName?: string; email?: string }, @Request() req: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Post('avatar')
  updateAvatar(@Body('avatar') avatar: string, @Request() req: any) {
    return this.usersService.updateAvatar(req.user.id, avatar);
  }

  @Delete('account')
  deleteAccount(@Body('password') password: string, @Request() req: any) {
    return this.usersService.deleteAccount(req.user.id, password);
  }
}
