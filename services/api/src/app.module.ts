import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FarmsModule } from './farms/farms.module';
import { SatelliteModule } from './satellite/satellite.module';
import { WeatherModule } from './weather/weather.module';
import { AiModule } from './ai/ai.module';
import { IrrigationModule } from './irrigation/irrigation.module';
import { PestsModule } from './pests/pests.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
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
    NotificationsModule,
    ReportsModule,
  ],
})
export class AppModule {}
