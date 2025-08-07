import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { DatabaseModule } from '@app/database';
import { UsersModule } from '@app/users';
import { RoleService } from './role/role.controller';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], // defaults to .env
    }),
    DatabaseModule,
    UsersModule,
    HealthModule,
  ],
  controllers: [RbacController, RoleService],
  providers: [RbacService, RoleService],
})
export class RbacModule {}
