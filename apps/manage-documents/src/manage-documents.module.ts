import { Module } from '@nestjs/common';
import { ManageDocumentsController } from './manage-documents.controller';
import { ManageDocumentsService } from './manage-documents.service';

@Module({
  imports: [],
  controllers: [ManageDocumentsController],
  providers: [ManageDocumentsService],
})
export class ManageDocumentsModule {}
