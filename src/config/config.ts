import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: 'test.env' });

export enum ConfigKey {
  App = 'APP',
  Db = 'DB',
}

export enum Environment {
  Development = 'development',
  Production = 'production',
  Testing = 'test',
}

const APPConfig = registerAs(ConfigKey.App, () => ({
  env: Environment[process.env.NODE_ENV as keyof typeof Environment] || 'development',
  port: Number(process.env.APP_PORT),
  appName: process.env.APP_NAME,
}));

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities:[join(__dirname, '..', '**', '*.entity.{ts,js}')],
  // migrations: [join(__dirname, '..', '..', 'migrations', '*.{ts,js}')], 
  // entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/migrations',
  },
  autoLoadEntities: true,
  synchronize: false,
};

const DBConfig = registerAs(ConfigKey.Db, () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
export const configurations = [APPConfig, DBConfig];
