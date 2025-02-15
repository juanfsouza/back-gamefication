import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('newsletter-opened')
  async handleOpen(@Body() data: any) {
    const { email, id } = data;

    if (!email || !id) return;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return;

    await this.prisma.newsletterOpen.create({
      data: {
        userId: user.id,
        newsletterId: id,
      },
    });

    // Atualiza streak se o usuário abriu a newsletter no dia correto
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastOpen = await this.prisma.newsletterOpen.findFirst({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    });

    if (!lastOpen || new Date(lastOpen.date).getTime() < today.getTime()) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { streak: user.streak + 1 },
      });
    }
  }
}
