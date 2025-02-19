import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(email: string, name?: string) {
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      this.logger.log(`🆕 Criando novo usuário: ${email}`);

      const defaultPassword = 'defaultPassword123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      user = await this.prisma.user.create({
        data: {
          email,
          name: name || null,
          password: hashedPassword,
        },
      });
    }

    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getUserStats(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        streakRecord: true,
        newsletters: true,
      },
    });
  
    if (!user) {
      this.logger.warn(`⚠️ Usuário ${id} não encontrado`);
      return { message: 'Usuário não encontrado' };
    }
  
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      streak: user.streakRecord ? user.streakRecord.currentStreak : 0,
      totalOpens: user.newsletters.length,
      lastOpened: user.newsletters.length ? user.newsletters[user.newsletters.length - 1]?.date : null,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`✏️ Atualizando usuário: ${id}`);
    
    const user = await this.prisma.user.findUnique({ where: { id } });
  
    if (!user) {
      this.logger.warn(`⚠️ Usuário ${id} não encontrado`);
      throw new NotFoundException('Usuário não encontrado');
    }
  
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  
    return updatedUser;
  }
}
