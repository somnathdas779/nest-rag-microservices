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
        protoPath: join(process.cwd(), './dist/libs/proto/user_auth.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
  const httpApp = await NestFactory.create(UserAuthModule);
  await httpApp.listen(4001); // port for health check
}
void bootstrap();
