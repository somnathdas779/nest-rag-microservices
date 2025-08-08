import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server, FileStore } from 'tus-node-server';
import { Observable } from 'rxjs';
import { GrpcMethod } from '@nestjs/microservices';
import { join } from 'path';

@Injectable()
export class UploadService implements OnModuleInit {
  private tusServer: Server;

  onModuleInit() {
    const uploadDir = join(process.cwd(), './uploads');

    this.tusServer = new Server({
      path: uploadDir, // required
    });

    // Set datastore separately
    this.tusServer.datastore = new FileStore({
      directory: uploadDir, // Correct option is 'directory' not 'path'
    });
  }

  @GrpcMethod('UploadService', 'StartUpload')
  startUpload(data: {
    fileId: string;
  }): Observable<{ success: boolean; message: string }> {
    // For demo: Just acknowledge start, real tus upload via HTTP
    return new Observable((observer) => {
      observer.next({ success: true, message: 'Upload started' });
      observer.complete();
    });
  }
}
