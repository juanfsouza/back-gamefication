import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';  // Certifique-se de importar o WebhooksService
import { PrismaService } from 'src/prisma/prisma.service';

describe('WebhooksController', () => {
  let webhooksController: WebhooksController;
  let webhooksService: WebhooksService;  // Definir o WebhooksService
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [
        WebhooksService,  // Adicionando WebhooksService
        PrismaService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn() },
            newsletterOpen: { create: jest.fn(), findFirst: jest.fn() },
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    webhooksController = module.get<WebhooksController>(WebhooksController);
    webhooksService = module.get<WebhooksService>(WebhooksService);  // Obter o WebhooksService
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('handleOpen', () => {
    it('should process newsletter-opened correctly', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', streak: 1 };
      const mockNewsletterData = { email: 'test@example.com', id: 'newsletter1' };

      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      prismaService.newsletterOpen.create = jest.fn();
      prismaService.user.update = jest.fn();

      await webhooksController.handleOpen(mockNewsletterData);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prismaService.newsletterOpen.create).toHaveBeenCalled();
      expect(prismaService.user.update).toHaveBeenCalled();
    });
  });
});
