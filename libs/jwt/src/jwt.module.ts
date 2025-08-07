import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { SharedJwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [SharedJwtService, ConfigService],

  exports: [SharedJwtService, ConfigService],
})
export class SharedJwtModule {}