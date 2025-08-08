import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UploadServiceClient {
  startUpload(data: {
    fileId: string;
  }): Observable<{ success: boolean; message: string }>;
}

@Injectable()
export class ManageDocumentsService implements OnModuleInit {
  private uploadServiceClient: UploadServiceClient;

  constructor(private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.uploadServiceClient =
      this.clientGrpc.getService<UploadServiceClient>('UploadService');
  }

  async uploadFile(filename: string, size: number) {
    const fileId = 'file-' + Date.now();
    const uploadResponse = await this.uploadServiceClient
      .startUpload({ fileId })
      .toPromise();
    return { fileId, status: uploadResponse.message };
  }
}
