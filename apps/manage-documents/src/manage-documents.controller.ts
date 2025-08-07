import { Controller, Get } from '@nestjs/common';
import { ManageDocumentsService } from './manage-documents.service';

@Controller()
export class ManageDocumentsController {
  constructor(private readonly manageDocumentsService: ManageDocumentsService) {}

  @Get()
  getHello(): string {
    return this.manageDocumentsService.getHello();
  }
}
