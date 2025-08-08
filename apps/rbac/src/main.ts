import { NestFactory } from '@nestjs/core';
import { RbacModule } from './rbac.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    RbacModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'role',
        protoPath: join(__dirname, '/dist/libs/proto'),
        url: '0.0.0.0:50053',
      },
    },
  );
  await app.listen();
  const httpApp = await NestFactory.create(RbacModule);
  await httpApp.listen(4003); // port for health check
}
void bootstrap();
