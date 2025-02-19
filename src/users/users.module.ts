import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
