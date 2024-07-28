import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CustomRequest } from '@/types';

const INVALID_TOKEN_AUTHORIZATION_TEXT = 'invalid_authorization_header';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  protected getToken(request: CustomRequest): string {
    const headers = new Headers(request.headers);
    const authorization = headers.get('authorization');
    if (
      !authorization ||
      !authorization.includes('Bearer') ||
      Array.isArray(authorization)
    ) {
      throw new UnauthorizedException(INVALID_TOKEN_AUTHORIZATION_TEXT);
    }
    const [_type, token] = authorization.split(' ');
    return token;
  }

  protected verifyToken(token: string): User {
    try {
      return this.jwtService.verify(token);
    } catch (_error) {
      throw new UnauthorizedException(INVALID_TOKEN_AUTHORIZATION_TEXT);
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<CustomRequest>();
    const token = this.getToken(request);
    const user = this.verifyToken(token);
    request.user = user;
    return true;
  }
}
