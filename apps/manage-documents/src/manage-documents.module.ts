import { Module } from '@nestjs/common';
import { ManageDocumentsController } from './manage-documents.controller';
import { ManageDocumentsService } from './manage-documents.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { MetricsController } from './metrics.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'UPLOAD_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'upload',
          protoPath: join(process.cwd(), './dist/libs/proto/upload.proto'),
          url: 'localhost:50052', // Upload service address
        },
      },
    ]),
    HealthModule,
  ],
  controllers: [ManageDocumentsController, MetricsController],
  providers: [ManageDocumentsService],
})
export class ManageDocumentsModule {}
