import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get(':farmId')
  getFarmReport(@Param('farmId') farmId: string) {
    return this.reportsService.getFarmReport(farmId);
  }
}
