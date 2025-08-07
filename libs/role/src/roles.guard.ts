// src/common/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '@app/users';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // no role restriction
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // must be populated by JWT Auth Guard
 

    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
