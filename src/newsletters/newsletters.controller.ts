import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newslettersService: NewslettersService) {}

  @Post()
  create(@Body() data: CreateNewsletterDto) {
    return this.newslettersService.createNewsletter(data);
  }

  @Get()
  findAll() {
    return this.newslettersService.getAllNewsletters();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newslettersService.getNewsletterById(id);
  }
}
