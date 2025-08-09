import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SharedJwtService } from './jwt.service';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: Partial<SharedJwtService>;
  let reflector: Reflector;
  let mockExecutionContext: any;

  beforeEach(() => {
    jwtService = {
      isTokenExpired: jest.fn(),
      verifyToken: jest.fn(),
    };
    reflector = new Reflector();
    guard = new JwtAuthGuard(jwtService as SharedJwtService, reflector);

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };
  });

  it('should throw if no Authorization header', () => {
    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException('No Authorization header'),
    );
  });

  it('should throw if token is expired', () => {
    mockExecutionContext.switchToHttp = () => ({
      getRequest: () => ({
        headers: { authorization: 'Bearer expiredtoken' },
      }),
    });

    (jwtService.isTokenExpired as jest.Mock).mockReturnValue(true);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      new UnauthorizedException('Invalid or expired token'),
    );
  });

  it('should throw if token is invalid', () => {
    mockExecutionContext.switchToHttp = () => ({
      getRequest: () => ({
        headers: { authorization: 'Bearer invalidtoken' },
      }),
    });

    (jwtService.isTokenExpired as jest.Mock).mockReturnValue(false);
    (jwtService.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => guard.canActivate(mockExecutionContext)).toThrow();
  });

  it('should attach user to request if token is valid', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockRequest = { headers: { authorization: 'Bearer validtoken' } };

    mockExecutionContext.switchToHttp = () => ({
      getRequest: () => mockRequest,
    });

    (jwtService.isTokenExpired as jest.Mock).mockReturnValue(false);
    (jwtService.verifyToken as jest.Mock).mockReturnValue(mockUser);

    const result = guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual(mockUser);
  });
});
