import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { User } from '@app/users'; // <-- import from users lib
export async function createTypeOrmOptions(
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> {
  const isProd = configService.get('NODE_ENV') === 'production';
  if (isProd) {
    const secrets = await getAwsDbSecrets('pg-db-secret');
    return {
      type: 'postgres',
      host: secrets.host,
      port: Number(secrets.port),
      username: secrets.username,
      password: secrets.password,
      database: secrets.dbname,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      ssl: true,
    };
  }

  // Local env config
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: Number(configService.get('DB_PORT')),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [User],
    synchronize: true,
  };
}

async function getAwsDbSecrets(secretName: string) {
  const client = new AWS.SecretsManager({ region: 'your-region' });

  const secretValue = await client
    .getSecretValue({ SecretId: secretName })
    .promise();

  if (!secretValue || !secretValue.SecretString) {
    throw new Error('Unable to retrieve DB secrets from AWS');
  }

  return JSON.parse(secretValue.SecretString);
}
