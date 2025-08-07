import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SharedJwtService } from './jwt.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: SharedJwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token || this.jwtService.isTokenExpired(token)) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = this.jwtService.verifyToken(token);
    request.user = user; // attach user to request object
    return true;
  }
}
