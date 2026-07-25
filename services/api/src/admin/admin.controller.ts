import { Controller, Get, Post, Patch, Put, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  overview() {
    return this.adminService.overview();
  }

  @Get('users')
  users(@Query('search') search?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.users(
      search,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get('users/:id')
  userDetail(@Param('id') id: string) {
    return this.adminService.userDetail(id);
  }

  @Get('support/conversations')
  supportConversations(@Query('userId') userId?: string, @Query('status') status?: string) {
    return this.adminService.supportConversations(userId, status);
  }

  @Get('support/conversations/:id/messages')
  supportMessages(@Param('id') id: string) {
    return this.adminService.supportMessages(id);
  }

  @Post('support/conversations/:id/messages')
  sendAdminMessage(@Param('id') id: string, @Request() req: any, @Body('text') text: string) {
    return this.adminService.sendAdminMessage(id, req.user.id, text);
  }

  @Patch('support/conversations/:id/status')
  updateConversationStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateConversationStatus(id, status);
  }

  @Get('landing-content')
  landingContent() {
    return this.adminService.landingContent();
  }

  @Put('landing-content')
  updateLandingContent(@Body() data: Record<string, any>) {
    return this.adminService.updateLandingContent(data);
  }
}
