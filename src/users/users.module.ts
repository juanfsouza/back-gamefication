import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'; // Importando o PrismaModule

@Module({
  imports: [PrismaModule], // Importando o PrismaModule
  providers: [UsersService],
})
export class UsersModule {}
