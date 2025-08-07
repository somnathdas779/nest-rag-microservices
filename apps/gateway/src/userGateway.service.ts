import { User } from '@app/users';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

interface RoleService {
  GetAllUser(data: {
    page: number;
    limit: number;
    search: string;
  }): Observable<any>;
}

@Injectable()
export class UserGatewayService implements OnModuleInit {
  private roleClient: RoleService;

  constructor(@Inject('RBAC_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.roleClient = this.client.getService<RoleService>('RoleService');
  }

  async findAllUser(page: number, limit: number, search: string) {
    return lastValueFrom(this.roleClient.GetAllUser({ page, limit, search }));
  }
}
