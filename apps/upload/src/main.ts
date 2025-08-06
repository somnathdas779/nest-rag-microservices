import { NestFactory } from '@nestjs/core';
import { UploadModule } from './upload.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UploadModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'upload',
        protoPath: join(__dirname, '../../libs/proto/src/upload.proto'),
        url: '0.0.0.0:50052',
      },
    },
  );
  await app.listen();
}
void bootstrap();
