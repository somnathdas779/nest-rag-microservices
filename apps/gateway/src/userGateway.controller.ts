import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserGatewayService } from './userGateway.service';
import { JwtAuthGuard } from '@app/jwt';
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserGatewayController {
  constructor(private readonly userGatewayService: UserGatewayService) {
    // Ensure gatewayService is not shadowed or overwritten
    if (!userGatewayService) {
      throw new Error('userGatewayService is not properly injected');
    }
  }

  @Get('find')
  async findAllUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    try {
      return await this.userGatewayService.findAllUser(page, limit, search);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      throw new Error(`Registration failed: ${message}`);
    }
  }
}
