import { Controller, Get } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';

@Controller()
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Get()
  health(): { status: string; message: string } {
    return { status: 'ok', message: 'User Auth Service is running' };
  }
}
