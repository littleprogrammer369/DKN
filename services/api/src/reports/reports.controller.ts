import { Controller, Get, Post, Param, Body, Request, UseGuards } from '@nestjs/common';
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

  @Get(':farmId/list')
  list(@Param('farmId') farmId: string) {
    return this.reportsService.listReports(farmId);
  }

  @Post(':farmId/generate')
  generate(@Param('farmId') farmId: string, @Body('type') type: string, @Request() req: any) {
    return this.reportsService.generateReport(farmId, type, req.user.id);
  }
}
