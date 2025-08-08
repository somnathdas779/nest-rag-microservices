import { NestFactory } from '@nestjs/core';
import { ManageDocumentsModule } from './manage-documents.module';
import * as main from './main';

describe('Main Bootstrap', () => {
  let mockApp: { listen: jest.Mock };

  beforeEach(() => {
    mockApp = { listen: jest.fn().mockResolvedValue(undefined) };
    jest.spyOn(NestFactory, 'create').mockResolvedValue(mockApp as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create app and listen on default port', async () => {
    process.env.port = ''; // simulate no env port

    await main['bootstrap']();

    expect(NestFactory.create).toHaveBeenCalledWith(ManageDocumentsModule);
    expect(mockApp.listen).toHaveBeenCalledWith(4000);
  });

  it('should use environment port if provided', async () => {
    process.env.port = '4000';

    await main['bootstrap']();

    expect(mockApp.listen).toHaveBeenCalledWith('4000');
  });
});
