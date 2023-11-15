import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '../helpers/jwt';
import { Request } from 'express';
import { LogoutTokenRepository } from './logout-token.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logoutTokenRepository: LogoutTokenRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const verifiedToken = verifyToken(token);
      const userId = verifiedToken.id;
      request['decoded'] = userId;
      const logout = await this.logoutTokenRepository.findTokenByUserIdAndAccessToken(userId, token);
      if (logout) {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
