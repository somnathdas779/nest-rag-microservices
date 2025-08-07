import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from '@app/users';
import { ConfigService } from '@nestjs/config';

import { v4 } from 'uuid';

@Controller()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @GrpcMethod()
  async registerUser(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const hashed: string = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      id: v4(),
      name,
      email,
      password: hashed,
    });
    if (!user) if (existing) throw new Error('Not able to register user.');
    return {
      success: true,
      message: `${email} - has been successfully registered.`,
    };
  }

  @GrpcMethod()
  async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('User not registered.');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign(
      { id: user.id, name: user.name, role: user.role },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_VALID_THROUGH'),
      },
    );
    return { token };
  }
}
