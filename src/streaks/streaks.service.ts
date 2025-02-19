import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsService } from 'src/analytics/analytics.service';

@Injectable()
export class StreaksService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService
  ) {}

  async getUserStreak(userId: string) {
    return this.prisma.streak.findUnique({
      where: { userId: userId },
    });
  }

  async updateStreak(userId: string, updateStreakDto: { currentStreak: number, lastOpenedAt: Date }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
  
    if (!streak) {
      const newStreak = await this.prisma.streak.create({
        data: {
          userId,
          currentStreak: updateStreakDto.currentStreak,
          lastOpenedAt: updateStreakDto.lastOpenedAt,
        },
      });
      await this.analyticsService.recordStreak(userId, updateStreakDto.currentStreak);
      return newStreak;
    }
  
    const updatedStreak = await this.prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: updateStreakDto.currentStreak,
        lastOpenedAt: updateStreakDto.lastOpenedAt,
      },
    });
  
    await this.analyticsService.recordStreak(userId, updatedStreak.currentStreak);
    return updatedStreak;
  }

  async createStreak(userId: string) {
    console.log(`🔍 Procurando usuário com ID: ${userId}`);
    
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    console.log(`🔎 Usuário encontrado: `, user);

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const streak = await this.prisma.streak.findUnique({ where: { userId } });

    if (streak) {
        return { message: 'Streak already exists for this user.' };
    }

    const newStreak = await this.prisma.streak.create({
        data: {
            userId,
            currentStreak: 1,
            lastOpenedAt: new Date(),
        },
    });
    
    await this.analyticsService.recordStreak(userId, 1);
    return newStreak;
  }

  async resetStreak(userId: string) {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
  
    if (!streak) {
      throw new Error('Streak não encontrado para o usuário');
    }
  
    const resetStreak = await this.prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: 0,
        lastOpenedAt: new Date(),
      },
    });
    
    await this.analyticsService.recordStreak(userId, 0);
    return resetStreak;
  }
}
