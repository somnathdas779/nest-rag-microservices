import { NestFactory } from '@nestjs/core';
import { ManageDocumentsModule } from './manage-documents.module';

async function bootstrap() {
  const app = await NestFactory.create(ManageDocumentsModule);
  await app.listen(process.env.port ?? 4000);
}
bootstrap();
