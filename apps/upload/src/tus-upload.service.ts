// tus-upload.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { Server, FileStore } from 'tus-node-server';

@Injectable()
export class TusUploadService implements OnModuleInit {
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

  getHandler() {
    return this.server.handle.bind(this.server);
  }
}
