import { Module } from '@nestjs/common';
import { AuthGatewayController } from './authGateway.controller';
import { AuthGatewayService } from './authGateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserGatewayController } from './userGateway.controller';
import { UserGatewayService } from './userGateway.service';
import { SharedJwtModule } from '@app/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
          protoPath: join(process.cwd(), 'libs/proto/user_auth.proto'),
          url: 'localhost:50051',
        },
      },
      {
        name: 'RBAC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'role',
          protoPath: join(process.cwd(), 'libs/proto/role.proto'),
          url: 'localhost:50053',
        },
      },

      {
        name: 'UPLOAD_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'upload',
          protoPath: join(process.cwd(), 'libs/proto/upload.proto'),
          url: 'localhost:50052',
        },
      },
    ]),
  ],
  controllers: [AuthGatewayController, UserGatewayController],
  providers: [AuthGatewayService, UserGatewayService],
})
export class GatewayModule {}
