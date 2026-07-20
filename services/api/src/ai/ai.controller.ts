import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
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
    @Body('expertiseLevel') expertiseLevel: string | undefined,
    @Request() req: any,
  ) {
    return this.aiService.chat(req.user.id, farmId, message, expertiseLevel as any);
  }

  @Get('history')
  getHistory(@Query('limit') limit: number, @Request() req: any) {
    return this.aiService.getHistory(req.user.id, limit || 20);
  }
}

