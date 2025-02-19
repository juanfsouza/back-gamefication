import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDtoType } from './dto/register.dto';
import { LoginDtoType } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // Registrar um novo usuário
  async register(registerDto: RegisterDtoType) {
    const { email, password, name } = registerDto;

    // Verificar se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar um novo usuário no banco de dados com Prisma
    const newUser = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
      select: { id: true, email: true, name: true, createdAt: true }, // Evita expor a senha
    });

    return { message: 'User registered successfully', user: newUser };
  }

  // Fazer login e gerar um token JWT
  async login(loginDto: LoginDtoType) {
    const { email, password } = loginDto;

    // Buscar o usuário no banco de dados
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Gerar o token JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  // Validar o token JWT
  async validateUser(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({ where: { email: payload.email } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { id: user.id, email: user.email, name: user.name }; // Retorna apenas informações essenciais
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
