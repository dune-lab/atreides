import { Migration, sql } from '@enxoval/db';

export class CreateUsers001 implements Migration {
  async up(): Promise<void> {
    await sql(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password_hash VARCHAR NOT NULL,
        email_verified BOOLEAN NOT NULL DEFAULT false,
        role VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  async down(): Promise<void> {
    await sql(`DROP TABLE IF EXISTS users`);
  }
}
