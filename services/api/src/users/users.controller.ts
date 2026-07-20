import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
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
}
