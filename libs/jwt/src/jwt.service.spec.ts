import { Test, TestingModule } from '@nestjs/testing';
import { SharedJwtService } from '@app/jwt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('SharedJwtService', () => {
  let service: SharedJwtService;
  let jwtService: JwtService;

  const mockJwtService = {
    verify: jest.fn(),
    decode: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedJwtService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SharedJwtService>(SharedJwtService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('should return decoded token when valid', () => {
      const decoded = { userId: 1 };
      mockJwtService.verify.mockReturnValue(decoded);

      const result = service.verifyToken('valid-token');
      expect(result).toEqual(decoded);
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: 'test-secret',
        ignoreExpiration: false,
      });
    });

    it('should throw UnauthorizedException when invalid', () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('invalid');
      });

      expect(() => service.verifyToken('bad-token')).toThrow(UnauthorizedException);
    });
  });

  describe('decodeToken', () => {
    it('should decode token', () => {
      const payload = { userId: 123 };
      mockJwtService.decode.mockReturnValue(payload);

      const result = service.decodeToken('some-token');
      expect(result).toEqual(payload);
      expect(mockJwtService.decode).toHaveBeenCalledWith('some-token');
    });
  });

  describe('isTokenExpired', () => {
    it('should return true if no exp field', () => {
      jest.spyOn(service, 'decodeToken').mockReturnValue({});
      expect(service.isTokenExpired('token')).toBe(true);
    });

    it('should return false if token not expired', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 60;
      jest.spyOn(service, 'decodeToken').mockReturnValue({ exp: futureExp });

      expect(service.isTokenExpired('token')).toBe(false);
    });

    it('should return true if token expired', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 60;
      jest.spyOn(service, 'decodeToken').mockReturnValue({ exp: pastExp });

      expect(service.isTokenExpired('token')).toBe(true);
    });
  });
});
