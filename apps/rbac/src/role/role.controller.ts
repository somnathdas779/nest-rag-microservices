import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import bcrypt from 'bcrypt';
import { UserService, UserRole } from '@app/users';
import { v4 } from 'uuid';

@Controller()
export class RoleService {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod()
  async getAllUser(data: {
    page: number;
    limit: number;
    search: string;
    id: string;
  }) {
    const { page, limit, search, id } = data;
    const users = await this.userService.findAll(page, limit, search, id);
    return { ...users, success: true };
  }

  @GrpcMethod()
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) {
    const { name, email, password, role } = data;
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new Error('Email already exist');
    const hashed: string = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      id: v4(),
      name,
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
  async updateRole(data: { id: string; role: UserRole }) {
    const { id, role } = data;
    const users = await this.userService.update(id, role);
    return { data: users, success: users.affected ? true : false };
  }
}
