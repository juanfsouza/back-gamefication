import { Module } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { NewslettersController } from './newsletters.controller';

@Module({
  providers: [NewslettersService],
  controllers: [NewslettersController]
})
export class NewslettersModule {}
