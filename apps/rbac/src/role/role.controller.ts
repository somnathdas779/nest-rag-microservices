import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import bcrypt from 'bcrypt';
import { UserService, UserRole } from '@app/users';
import { v4 } from 'uuid';

@Controller()
export class RoleService {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod()
  async getAllUser(data: { page: number; limit: number; search: string }) {
    const { page, limit, search } = data;
    const users = await this.userService.findAll(page, limit, search);
    console.log({ ...users, success: true });
    return { ...users, success: true };
  }

  @GrpcMethod()
  async createUser(data: { email: string; password: string; role: UserRole }) {
    const { email, password, role } = data;
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const hashed: string = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      id: v4(),
      email,
      password: hashed,
      role,
    });
    if (!user) if (existing) throw new Error('Not able to create new user.');
    return {
      success: true,
      message: `${email} - User Successfully created.`,
    };
  }

  @GrpcMethod()
  async updateRole(data: { id: number; role: UserRole }) {
    const { id, role } = data;
    const users = await this.userService.update(id, { role });
    return { data: users, success: true };
  }
}
