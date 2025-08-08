// tus-upload.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import { Server, FileStore, EVENTS } from 'tus-node-server';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class TusUploadService implements OnModuleInit {
  private tusServer: Server;
  private uploadDir;

  decodeTusMetadata(metadataString) {
    const metadata = {};
    metadataString.split(',').forEach((pair) => {
      const [key, base64Value] = pair.split(' ');
      metadata[key] = Buffer.from(base64Value, 'base64').toString('utf8');
    });
    return metadata;
  }

  onModuleInit() {
    const uploadDir = join(process.cwd(), './uploads');
    this.uploadDir = uploadDir;

    this.tusServer = new Server({
      path: uploadDir, // required
    });

    // Set datastore separately
    this.tusServer.datastore = new FileStore({
      directory: uploadDir, // Correct option is 'directory' not 'path'
    });

    this.tusServer.on(EVENTS.EVENT_UPLOAD_COMPLETE, (event) => {
      setImmediate(() => {
        console.log(
          '---->',
          this.decodeTusMetadata(event?.file?.upload_metadata),
        );
      });
    });
  }

  getHandler() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.tusServer.handle.bind(this.tusServer);
  }
}
