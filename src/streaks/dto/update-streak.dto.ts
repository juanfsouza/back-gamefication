import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateStreakDto {
  @IsOptional()
  @IsInt()
  currentStreak?: number;

  @IsOptional()
  @IsString()
  lastOpenedAt?: string;
}
