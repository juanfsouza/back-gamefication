import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(token: string) {
    try {
      // Você precisa fornecer o sessionId e o token
      const sessionId = "ID_DA_SESSÃO"; // Isso deve ser obtido de algum lugar ou passado para o método
      const session = await clerkClient.sessions.verifySession(sessionId, token);
      return session;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}