import { Inject, Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

interface AuthServiceClient {
  RegisterUser(data: {
    email: string;
    password: string;
  }): Observable<{ token: string; message: string }>;
  LoginUser(data: {
    email: string;
    password: string;
  }): Observable<{ token: string; message: string }>;
}

@Injectable()
export class AuthService {
  private authClient: AuthServiceClient;

  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authClient = this.client.getService<AuthServiceClient>('AuthService');
  }

  async register(email: string, password: string) {
    return lastValueFrom(this.authClient.RegisterUser({ email, password }));
  }

  async login(email: string, password: string) {
    return lastValueFrom(this.authClient.LoginUser({ email, password }));
  }
}
