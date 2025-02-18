import { Module } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],  // PrismaModule is imported here
  providers: [NewslettersService],  // NewslettersService is provided here
  controllers: [NewslettersController],
})
export class NewslettersModule {}
