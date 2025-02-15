import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { AuthService } from './auth.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
  
      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        const user = await this.authService.validateUser(token);
        request['user'] = user;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  