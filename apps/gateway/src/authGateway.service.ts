import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

interface AuthService {
  RegisterUser(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<{ status: boolean; message: string }>;
  LoginUser(data: {
    email: string;
    password: string;
  }): Observable<{ token: string; message: string }>;
}

@Injectable()
export class AuthGatewayService implements OnModuleInit {
  private authClient: AuthService;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authClient = this.client.getService<AuthService>('AuthService');
  }

  async register(name: string, email: string, password: string) {
    return lastValueFrom(
      this.authClient.RegisterUser({ name, email, password }),
    );
  }

  async login(email: string, password: string) {
    return lastValueFrom(this.authClient.LoginUser({ email, password }));
  }
}
