import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
