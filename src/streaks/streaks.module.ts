import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [PrismaModule, AnalyticsModule], 
  providers: [StreaksService],
  controllers: [StreaksController],
})
export class StreaksModule {}
