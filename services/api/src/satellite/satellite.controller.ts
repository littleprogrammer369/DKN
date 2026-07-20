import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SatelliteService } from './satellite.service';

@Controller('satellite')
@UseGuards(AuthGuard('jwt'))
export class SatelliteController {
  constructor(private satelliteService: SatelliteService) {}

  @Get(':farmId')
  getLatest(@Param('farmId') farmId: string) {
    return this.satelliteService.getLatest(farmId);
  }

  @Get(':farmId/history')
  getHistory(@Param('farmId') farmId: string, @Query('days') days: number) {
    return this.satelliteService.getHistory(farmId, days || 30);
  }
}
