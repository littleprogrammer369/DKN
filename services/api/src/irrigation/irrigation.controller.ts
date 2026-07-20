import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IrrigationService } from './irrigation.service';

@Controller('irrigation')
@UseGuards(AuthGuard('jwt'))
export class IrrigationController {
  constructor(private irrigationService: IrrigationService) {}

  @Get('recommend/:farmId')
  getRecommendation(@Param('farmId') farmId: string) {
    return this.irrigationService.getRecommendation(farmId);
  }

  @Post('log/:farmId')
  logAction(@Param('farmId') farmId: string, @Body() body: any, @Request() req: any) {
    return this.irrigationService.logAction(farmId, req.user.id, body);
  }

  @Get('history/:farmId')
  getHistory(@Param('farmId') farmId: string) {
    return this.irrigationService.getHistory(farmId);
  }
}
