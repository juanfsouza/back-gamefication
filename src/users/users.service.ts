import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(email: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      const defaultPassword = 'senha_temporal'; // Substituir por um hash seguro

      user = await this.prisma.user.create({
        data: {
          email,
          name: null,
          password: defaultPassword,
        },
      });
    }

    return user;
  }

  async getUserStats(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        streakData: true,
        newsletters: true,
      },
    });

    if (!user) {
      return { message: 'Usuário não encontrado' };
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      streak: user.streak,
      totalOpens: user.newsletters.length,
      lastOpened: user.newsletters.length ? user.newsletters[user.newsletters.length - 1]?.date : null,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
