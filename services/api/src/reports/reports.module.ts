import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsScheduler } from './reports-scheduler.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportsScheduler],
})
export class ReportsModule {}
