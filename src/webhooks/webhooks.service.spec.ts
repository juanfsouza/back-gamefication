import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksService } from './webhooks.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service'; // ✅ Caminho relativo

describe('WebhooksService', () => {
  let webhooksService: WebhooksService;
  let prismaService: PrismaService;
  let usersService: UsersService;

  // ✅ Criamos um mock do PrismaService para evitar chamadas reais ao banco
  const prismaMock = {
    streak: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  // ✅ Mock do UsersService para evitar chamadas reais ao banco
  const usersServiceMock = {
    findOrCreateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhooksService,
        { provide: PrismaService, useValue: prismaMock }, // ✅ Mockando PrismaService
        { provide: UsersService, useValue: usersServiceMock }, // ✅ Mockando UsersService
      ],
    }).compile();

    webhooksService = module.get<WebhooksService>(WebhooksService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('deve criar um streak se for a primeira abertura', async () => {
    // ✅ Simula um usuário completo, com todos os campos obrigatórios
    const mockUser = {
      id: 'user-1',
      email: 'teste@example.com',
      name: 'Test User',
      streak: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    usersServiceMock.findOrCreateUser.mockResolvedValue(mockUser);
    prismaMock.streak.findUnique.mockResolvedValue(null);
    prismaMock.streak.create.mockResolvedValue({
      id: 1,
      userId: 'user-1',
      currentStreak: 1,
      lastOpenedAt: new Date(),
    });

    await webhooksService.handleNewsletterOpened({ email: 'teste@example.com', id: 'newsletter-1' });

    expect(prismaMock.streak.create).toHaveBeenCalled();
  });
});
