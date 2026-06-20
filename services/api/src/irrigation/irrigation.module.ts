import { Module } from '@nestjs/common';
import { IrrigationService } from './irrigation.service';
import { IrrigationController } from './irrigation.controller';

@Module({
  controllers: [IrrigationController],
  providers: [IrrigationService],
})
export class IrrigationModule {}
