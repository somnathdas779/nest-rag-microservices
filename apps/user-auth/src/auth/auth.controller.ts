import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from '@app/users';

import { v4 } from 'uuid';

@Controller()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  @GrpcMethod()
  async registerUser(data: { email: string; password: string }) {
    const { email, password } = data;
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const hashed: string = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      id: v4(),
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
      { sub: user.id, role: user.role },
      {
        secret: 'some-secret',
        expiresIn: '1h',
      },
    );
    return { token };
  }
}
