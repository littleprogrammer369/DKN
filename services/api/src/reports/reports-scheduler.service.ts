import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { ReportsService } from './reports.service';

@Injectable()
export class ReportsScheduler {
  constructor(private reports: ReportsService, private prisma: PrismaService) {}

  private enabled() { return process.env.REPORTS_CRON_ENABLED === 'true'; }

  @Cron('0 6 * * 6')  // Saturdays 06:00
  async weekly() { if (!this.enabled()) return; await this.run('weekly'); }

  @Cron('0 6 1 * *')  // 1st of month 06:00
  async monthly() { if (!this.enabled()) return; await this.run('monthly'); }

  private async run(type: string) {
    const farms = await this.prisma.farm.findMany({ where: { isActive: true }, select: { id: true } });
    for (const f of farms) {
      try { await this.reports.generateReport(f.id, type); } catch {}
    }
  }
}
