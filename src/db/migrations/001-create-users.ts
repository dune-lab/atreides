import { Migration, MigrationRunner, sql } from '@enxoval/db';

export class CreateUsers001 extends Migration {
  name = '001-create-users';

  async up(runner: MigrationRunner): Promise<void> {
    await sql(runner, `
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

  async down(runner: MigrationRunner): Promise<void> {
    await sql(runner, `DROP TABLE IF EXISTS users`);
  }
}
