import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { SatelliteModule } from './satellite/satellite.module';
import { WeatherModule } from './weather/weather.module';
import { AiModule } from './ai/ai.module';
import { IrrigationModule } from './irrigation/irrigation.module';
import { PestsModule } from './pests/pests.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    FarmsModule,
    SatelliteModule,
    WeatherModule,
    AiModule,
    IrrigationModule,
    PestsModule,
  ],
})
export class AppModule {}
