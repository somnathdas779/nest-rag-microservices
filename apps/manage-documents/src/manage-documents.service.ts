import { Injectable } from '@nestjs/common';

@Injectable()
export class ManageDocumentsService {
  getHello(): string {
    return 'Hello World!';
  }
}
