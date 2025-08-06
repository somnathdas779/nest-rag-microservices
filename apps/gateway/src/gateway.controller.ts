import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
  /**
   * Health check endpoint to verify if the gateway service is running.
   * @returns An object with status and message.
   */
  @Get('health')
  health(): { status: string; message: string } {
    return { status: 'ok', message: 'Gateway Service is running' };
  }

  constructor(private readonly gatewayService: GatewayService) {
    // Ensure gatewayService is not shadowed or overwritten
    if (!gatewayService || typeof gatewayService.register !== 'function') {
      throw new Error('gatewayService is not properly injected');
    }
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    try {
      return await this.gatewayService.register(body.email, body.password);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      throw new Error(`Registration failed: ${message}`);
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.gatewayService.login(body.email, body.password);
    } catch (error) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : String(error);
      throw new Error(`Login failed: ${message}`);
    }
  }
}
