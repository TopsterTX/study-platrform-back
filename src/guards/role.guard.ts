import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from '@/decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    const roles = this.reflector.get(Roles, handler);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const role = user?.role;
    if (!role) {
      throw new BadRequestException('role_not_found');
    }
    const isMatchRole = roles.includes(role);
    if (!isMatchRole) {
      throw new ForbiddenException('forbidden_resource');
    }
    return true;
  }
}
