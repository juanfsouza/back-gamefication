import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async handleNewsletterOpened(createWebhookDto: CreateWebhookDto) {
    const { email, id, utm_source, utm_medium, utm_campaign, utm_channel } = createWebhookDto;
    this.logger.log(`📩 Processando abertura de newsletter para ${email}, edição ${id}`);

    const user = await this.usersService.findOrCreateUser(email);
    if (!user) {
      this.logger.error('❌ Usuário não pôde ser criado ou encontrado.');
      throw new Error('Usuário não pôde ser criado ou encontrado.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🛑 Evita registrar múltiplas aberturas no mesmo dia
    const existingOpen = await this.prisma.newsletterOpen.findFirst({
      where: { userId: user.id, newsletterId: id, date: { gte: today } }, // 🔄 Mudando openedAt para date
    });

    if (existingOpen) {
      this.logger.warn(`⚠️ Abertura já registrada para ${email} na edição ${id}`);
      return;
    }

    // ✅ Registra a abertura da newsletter
    await this.prisma.newsletterOpen.create({
      data: {
        userId: user.id,
        newsletterId: id,
        date: new Date(),
      },
    });

    // 📈 Atualiza o streak do usuário
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const streak = await this.prisma.streak.findUnique({ where: { userId: user.id } });

    if (!streak) {
      this.logger.log(`🆕 Criando primeiro streak para ${email}`);
      await this.prisma.streak.create({
        data: {
          userId: user.id,
          currentStreak: 1,
          lastOpenedAt: today,
        },
      });
    } else {
      const lastOpenedDate = new Date(streak.lastOpenedAt);
      lastOpenedDate.setHours(0, 0, 0, 0);

      if (lastOpenedDate.getTime() === today.getTime()) {
        this.logger.log(`⚠️ Usuário ${email} já abriu a newsletter hoje. Streak mantido.`);
      } else if (lastOpenedDate.getTime() === yesterday.getTime()) {
        this.logger.log(`🔥 Streak continuado para ${email}`);
        await this.prisma.streak.update({
          where: { userId: user.id },
          data: {
            currentStreak: streak.currentStreak + 1,
            lastOpenedAt: today,
          },
        });
      } else {
        this.logger.log(`🔄 Streak resetado para ${email}`);
        await this.prisma.streak.update({
          where: { userId: user.id },
          data: {
            currentStreak: 1,
            lastOpenedAt: today,
          },
        });
      }
    }

    this.logger.log(`✅ Webhook processado com sucesso para ${email}`);
  }
}
