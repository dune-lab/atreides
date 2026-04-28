import 'reflect-metadata';
import { join } from 'node:path';
import { createDataSource } from '@enxoval/db';
import { UserSchema } from './wire/user';

export const AppDataSource = createDataSource({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'atreides',
  entities: [UserSchema],
  migrationsDir: join(__dirname, 'migrations'),
});
