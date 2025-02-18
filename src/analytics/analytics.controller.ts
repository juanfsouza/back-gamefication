import { Controller, Get, Post, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAnalytics() {
    return this.analyticsService.getAnalytics();
  }

  @Post(':userId/:streak')
  recordStreak(@Param('userId') userId: string, @Param('streak') streak: number) {
    return this.analyticsService.recordStreak(userId, Number(streak));
  }
}
