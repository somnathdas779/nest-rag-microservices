import { NestFactory } from '@nestjs/core';
import { ManageDocumentsModule } from './manage-documents.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ManageDocumentsModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'upload',
        protoPath: join(process.cwd(), './dist/libs/proto/upload.proto'),
        url: '0.0.0.0:50054',
      },
    },
  );
  await app.listen();
  const httpApp = await NestFactory.create(ManageDocumentsModule);
  await httpApp.listen(4004); // port for health check
}
bootstrap();
