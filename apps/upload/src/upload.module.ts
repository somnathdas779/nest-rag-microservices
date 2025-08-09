import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { HealthModule } from './health/health.module';
import { TusUploadService } from './tus-upload.service';
import { MetricsController } from './metrics.controller';
@Module({
  imports: [HealthModule],
  controllers: [UploadController, MetricsController],
  providers: [TusUploadService],
})
export class UploadModule {}
