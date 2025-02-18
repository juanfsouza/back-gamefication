import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporte o PrismaService para que possa ser utilizado em outros módulos
})
export class PrismaModule {}
