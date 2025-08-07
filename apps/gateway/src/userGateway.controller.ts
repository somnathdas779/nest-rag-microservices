import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserGatewayService } from './userGateway.service';
import { JwtAuthGuard } from '@app/jwt';
import { User, UserRole } from '@app/users';
import { Roles, RolesGuard } from '@app/role';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserGatewayController {
  constructor(private readonly userGatewayService: UserGatewayService) {
    // Ensure gatewayService is not shadowed or overwritten
    if (!userGatewayService) {
      throw new Error('userGatewayService is not properly injected');
    }
  }

  @Get('')
  getUser(@Req() req: { user: Partial<User> }) {
    try {
      const { id, name, role } = req?.user;
      return { success: true, user: { id, name, role } };
    } catch (error) {
      throw new Error(`get user  failed: ${error?.message}`);
    }
  }

  @Get('find')
  @Roles(UserRole.ADMIN, UserRole.ADMIN, UserRole.VIEWER)
  async findAllUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Req() req: { user: Partial<User> },
  ) {
    try {
      const { id } = req?.user;
      if (!id) throw new Error(`findAllUser failed user not found`);
      return await this.userGatewayService.findAllUser(page, limit, search, id);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      throw new Error(`findAllUser failed: ${message}`);
    }
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role: string;
    },
  ) {
    try {
      return await this.userGatewayService.createUser(body);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      throw new Error(`findAllUser failed: ${message}`);
    }
  }

  @Patch(':userId/:roleName')
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('userId') userId: string,
    @Param('roleName') roleName: UserRole,
    @Req() req: { user: Partial<User> },
  ) {
    try {
      const { id } = req?.user;
      if (id == userId) throw new Error(`Not allowed`);
      return await this.userGatewayService.updateUser(userId, roleName);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      throw new Error(`updateUser failed: ${message}`);
    }
  }
}
