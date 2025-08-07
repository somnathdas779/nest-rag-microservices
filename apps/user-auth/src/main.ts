import { NestFactory } from '@nestjs/core';
import { UserAuthModule } from './user-auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserAuthModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'userauth',
        protoPath: join(__dirname, '../../libs/proto/user_auth.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
}
void bootstrap();
