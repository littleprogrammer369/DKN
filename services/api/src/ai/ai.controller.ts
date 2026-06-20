import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  chat(
    @Body('message') message: string,
    @Body('farmId') farmId: string | undefined,
    @Request() req: any,
  ) {
    return this.aiService.chat(req.user.id, farmId, message);
  }

  @Get('history')
  getHistory(@Query('limit') limit: number, @Request() req: any) {
    return this.aiService.getHistory(req.user.id, limit || 20);
  }
}
