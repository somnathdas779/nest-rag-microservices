import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthGatewayController } from './authGateway.controller';
import { AuthGatewayService } from './authGateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserGatewayController } from './userGateway.controller';
import { UserGatewayService } from './userGateway.service';
import { SharedJwtModule } from '@app/jwt';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { HttpModule } from '@nestjs/axios';
import { TusProxyMiddleware } from './tus-proxy.middleware';
import { MetricsController } from './metrics.controller';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], // defaults to .env
    }),
    SharedJwtModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'userauth',
          protoPath: join(process.cwd(), './dist/libs/proto/user_auth.proto'),
          url: 'localhost:50051',
        },
      },
      {
        name: 'RBAC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'role',
          protoPath: join(process.cwd(), './dist/libs/proto/role.proto'),
          url: 'localhost:50053',
        },
      },
      {
        name: 'DOCUMENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'upload',
          protoPath: join(process.cwd(), './dist/libs/proto/upload.proto'),
          url: 'localhost:50054', // Document service address
        },
      },
    ]),
    HealthModule,
  ],
  controllers: [
    AuthGatewayController,
    UserGatewayController,
    MetricsController,
  ],
  providers: [AuthGatewayService, UserGatewayService],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TusProxyMiddleware).forRoutes('/files');
  }
}
