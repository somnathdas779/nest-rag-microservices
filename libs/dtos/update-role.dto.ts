import { IsEnum } from 'class-validator';
import { UserRole } from import { User } from '../entities/user.entity';; // UserRole must be an enum

export class UpdateRoleDto {
  @IsEnum(UserRole, { message: 'Role must be one of: admin, editor, viewer' })
  role: UserRole;
}
