import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';

@Module({
  providers: [StreaksService],
  controllers: [StreaksController]
})
export class StreaksModule {}
