import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewslettersService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewsletter(data: { title: string; content: string }) {
    return this.prisma.newsletter.create({
      data,
    });
  }

  async getAllNewsletters() {
    return this.prisma.newsletter.findMany();
  }

  async getNewsletterById(id: string) {
    return this.prisma.newsletter.findUnique({
      where: { id },
    });
  }
}
