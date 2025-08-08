import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SharedJwtService } from './jwt.service';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<SharedJwtService>;
  let reflector: Reflector;

  beforeEach(() => {
    jwtService = {
      isTokenExpired: jest.fn(),
      verifyToken: jest.fn(),
    } as any;

    reflector = {} as Reflector;

    guard = new JwtAuthGuard(jwtService, reflector);
  });

  const mockExecutionContext = (headers: Record<string, string>): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should throw if Authorization header is missing', () => {
    const context = mockExecutionContext({});
    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('No Authorization header'),
    );
  });

  it('should throw if token is missing or expired', () => {
    jwtService.isTokenExpired.mockReturnValue(true);
    const context = mockExecutionContext({
      authorization: 'Bearer fake.token',
    });

    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Invalid or expired token'),
    );
  });

  it('should allow if token is valid', () => {
    jwtService.isTokenExpired.mockReturnValue(false);
    jwtService.verifyToken.mockReturnValue({ id: 1, username: 'test' });

    const context = mockExecutionContext({
      authorization: 'Bearer valid.token',
    });

    const result = guard.canActivate(context);
    expect(result).toBe(true);
    expect(jwtService.isTokenExpired).toHaveBeenCalledWith('valid.token');
    expect(jwtService.verifyToken).toHaveBeenCalledWith('valid.token');

    const req = context.switchToHttp().getRequest();
    expect(req.user).toEqual({ id: 1, username: 'test' });
  });
});
