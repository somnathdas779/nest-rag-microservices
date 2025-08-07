import { Test, TestingModule } from '@nestjs/testing';
import { ManageDocumentsController } from './manage-documents.controller';
import { ManageDocumentsService } from './manage-documents.service';

describe('ManageDocumentsController', () => {
  let manageDocumentsController: ManageDocumentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ManageDocumentsController],
      providers: [ManageDocumentsService],
    }).compile();

    manageDocumentsController = app.get<ManageDocumentsController>(ManageDocumentsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(manageDocumentsController.getHello()).toBe('Hello World!');
    });
  });
});
