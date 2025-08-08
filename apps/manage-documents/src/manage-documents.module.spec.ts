import { Test, TestingModule } from '@nestjs/testing';
import { ManageDocumentsModule } from './manage-documents.module';
import { ManageDocumentsController } from './manage-documents.controller';
import { ManageDocumentsService } from './manage-documents.service';

describe('ManageDocumentsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ManageDocumentsModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have ManageDocumentsController', () => {
    const controller = module.get<ManageDocumentsController>(ManageDocumentsController);
    expect(controller).toBeInstanceOf(ManageDocumentsController);
  });

  it('should have ManageDocumentsService', () => {
    const service = module.get<ManageDocumentsService>(ManageDocumentsService);
    expect(service).toBeInstanceOf(ManageDocumentsService);
  });
});
