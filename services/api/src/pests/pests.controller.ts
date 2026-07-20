import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PestsService } from './pests.service';

@Controller('pests')
@UseGuards(AuthGuard('jwt'))
export class PestsController {
  constructor(private pestsService: PestsService) {}

  @Get('threats/:farmId')
  getThreats(@Param('farmId') farmId: string) {
    return this.pestsService.getActiveThreats(farmId);
  }

  @Get('risk/:farmId')
  getRiskLevel(@Param('farmId') farmId: string) {
    return this.pestsService.getRiskLevel(farmId);
  }
}
