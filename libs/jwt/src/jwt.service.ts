import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedJwtService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
        ignoreExpiration: false,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  isTokenExpired(token: string): boolean {
    const decoded: any = this.decodeToken(token);
    if (!decoded?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }
}
