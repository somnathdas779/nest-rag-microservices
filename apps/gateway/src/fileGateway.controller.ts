import { Controller, Post, Body } from '@nestjs/common';
import { UploadGatewayService } from './uploadGateway.service';

@Controller('files')
export class FileGatewayController {
  constructor(private readonly uploadService: UploadGatewayService) {
    // Ensure uploadService is not shadowed or overwritten
    if (!uploadService) {
      throw new Error('uploadService is not properly injected');
    }
  }

  @Post('upload')
  async uploadFile(@Body() body: { filename: string; size: number }) {
    return await this.uploadService.uploadFile(body);
  }
}
