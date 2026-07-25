import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupportService } from './support.service';

@Controller('support')
@UseGuards(AuthGuard('jwt'))
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Get('conversations')
  myConversations(@Request() req: any) {
    return this.supportService.myConversations(req.user.id);
  }

  @Post('conversations')
  createConversation(@Request() req: any, @Body('subject') subject?: string) {
    return this.supportService.createConversation(req.user.id, subject);
  }

  @Get('conversations/:id/messages')
  myMessages(@Param('id') id: string, @Request() req: any) {
    return this.supportService.getMessages(id, req.user.id);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id') id: string, @Request() req: any, @Body('text') text: string) {
    return this.supportService.sendMessage(id, req.user.id, text);
  }
}
