import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.1.1',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'RAG_USER_DB',
  logging: true,
  entities: [
    join(__dirname, '..', '..', '..', 'libs', '**', '*.entity.{js,ts}'),
  ],
  synchronize: true,
};
