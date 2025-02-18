import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,  // Injete o PrismaService
  ) {}

  // Registrar um novo usuário
  async register(registerDto: any) {
    const { email, password, name } = registerDto;

    // Verifique se o usuário já existe no banco de dados
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar um novo usuário no banco de dados com o Prisma
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { message: 'User registered successfully', user: newUser };
  }

  // Fazer login e gerar o token
  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Buscar o usuário no banco de dados
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Gerar o token JWT
    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  // Validar o token JWT (será utilizado no guard)
  async validateUser(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({ where: { email: payload.email } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
