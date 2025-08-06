import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';

describe('UserAuthController', () => {
  let userAuthController: UserAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserAuthController],
      providers: [UserAuthService],
    }).compile();

    userAuthController = app.get<UserAuthController>(UserAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userAuthController.getHello()).toBe('Hello World!');
    });
  });
});
