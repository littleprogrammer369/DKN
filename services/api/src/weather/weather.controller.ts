import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WeatherService } from './weather.service';

@Controller('weather')
@UseGuards(AuthGuard('jwt'))
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get(':farmId')
  getCurrent(@Param('farmId') farmId: string) {
    return this.weatherService.getLatest(farmId);
  }

  @Get(':farmId/history')
  getHistory(@Param('farmId') farmId: string, @Query('days') days: number) {
    return this.weatherService.getHistory(farmId, days || 7);
  }
}
