import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async recordStreak(userId: string, streak: number) {
    return this.prisma.analytics.upsert({
      where: { userId },
      update: { streak, date: new Date() },
      create: { userId, streak, date: new Date() },
    });
  }

  async getAnalytics() {
    return this.prisma.analytics.findMany();
  }
}
