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
    const cookies = request.cookies;
    const accessTokenCookie = cookies['access_token'];
    if (!accessTokenCookie) {
      throw new UnauthorizedException(INVALID_TOKEN_AUTHORIZATION_TEXT);
    }
    return accessTokenCookie;
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
    request.user = this.verifyToken(token);

    return true;
  }
}
