import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { HealthModule } from './health/health.module';
import { TusUploadService } from './tus-upload.service';
@Module({
  imports: [HealthModule],
  controllers: [UploadController],
  providers: [TusUploadService],
})
export class UploadModule {}
