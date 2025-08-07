import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { AuthService } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '@app/database';
import { UsersModule } from '@app/users';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'], // defaults to .env
    }),
    DatabaseModule,
    UsersModule,
    JwtModule,
    HealthModule,
  ],
  controllers: [UserAuthController, AuthService],
  providers: [UserAuthService, AuthService],
})
export class UserAuthModule {}
