import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WeatherService } from './weather.service';

@Controller('weather')
@UseGuards(AuthGuard('jwt'))
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get(':farmId')
  getCurrent(@Param('farmId') farmId: string) {
    return this.weatherService.getLatestFromDb(farmId);
  }

  @Get(':farmId/history')
  getHistory(@Param('farmId') farmId: string, @Query('days') days: number) {
    return this.weatherService.getHistory(farmId, days || 7);
  }

  @Get(':farmId/dashboard')
  getDashboard(@Param('farmId') farmId: string, @Query('city') city: string) {
    return this.weatherService.getDashboardData(farmId, city || 'ساوه');
  }
}
