import { User } from '@app/users';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { UserRole } from 'aws-sdk/clients/workmail';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

interface RoleService {
  GetAllUser(data: {
    page: number;
    limit: number;
    search: string;
    id: string;
  }): Observable<any>;
  CreateUser(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<any>;
  UpdateRole(data: { id: string; role: UserRole }): Observable<any>;
}

@Injectable()
export class UserGatewayService implements OnModuleInit {
  private roleClient: RoleService;

  constructor(@Inject('RBAC_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.roleClient = this.client.getService<RoleService>('RoleService');
  }

  async findAllUser(page: number, limit: number, search: string, id: string) {
    return lastValueFrom(
      this.roleClient.GetAllUser({ page, limit, search, id }),
    );
  }

  async createUser(body: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    return lastValueFrom(this.roleClient.CreateUser(body));
  }

  async updateUser(id: string, role: UserRole) {
    return lastValueFrom(this.roleClient.UpdateRole({ id, role }));
  }
}
