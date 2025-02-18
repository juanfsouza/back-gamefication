import { Controller, Get, Param, Patch, Delete, Post } from '@nestjs/common';
import { StreaksService } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get(':userId')
  getStreak(@Param('userId') userId: string) {
    return this.streaksService.getUserStreak(userId);
  }

  @Patch(':userId')
  updateStreak(@Param('userId') userId: string) {
    return this.streaksService.updateStreak(userId);
  }

  @Post(':userId')
  createStreak(@Param('userId') userId: string) {
    return this.streaksService.createStreak(userId);
  }

  @Delete(':userId')
  resetStreak(@Param('userId') userId: string) {
    return this.streaksService.resetStreak(userId);
  }
}
