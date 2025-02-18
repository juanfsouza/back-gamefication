import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]; // Obter o token do header Authorization

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
      // Verificar a validade do token
      const user = await this.authService.validateUser(token);
      req.user = user; // Adicionar o usuário à requisição
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
