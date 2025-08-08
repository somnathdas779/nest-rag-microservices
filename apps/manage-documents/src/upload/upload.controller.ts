import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class DocumentService {
  // private uploadClient: ManageDocumentServiceClient;

  // constructor(@Inject('AUTH_SERVICE') private readonly client: ClientGrpc) {}

  // onModuleInit() {
  //   this.uploadClient = this.client.getService<ManageDocumentServiceClient>(
  //     'ManageDocumentServiceClient',
  //   );
  // }
  @GrpcMethod()
  async uploadFile(data: { filename: string; size: number }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  }
}
