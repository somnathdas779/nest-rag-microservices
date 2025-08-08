import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

interface DocumentService {
  UploadFile(data: {
    filename: string;
    size: number;
  }): Observable<{ fileId: string; status: string }>;
}

@Injectable()
export class UploadGatewayService implements OnModuleInit {
  private uploadClient: DocumentService;

  constructor(
    @Inject('DOCUMENT_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.uploadClient =
      this.client.getService<DocumentService>('DocumentService');
  }

  async uploadFile(body: { filename: string; size: number }) {
    const { filename, size } = body;
    return lastValueFrom(this.uploadClient.UploadFile({ filename, size }));
  }
}
