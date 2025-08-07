import { Test, TestingModule } from '@nestjs/testing';
import { SharedJwtService } from './jwt.service';

describe('JwtService', () => {
  let service: SharedJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedJwtService],
    }).compile();

    service = module.get<SharedJwtService>(SharedJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
