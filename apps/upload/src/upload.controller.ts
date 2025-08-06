import { Controller, Get } from '@nestjs/common';
import { UploadService } from './upload.service';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  health(): { status: string; message: string } {
    return { status: 'ok', message: 'Upload Service is running' };
  }
}
