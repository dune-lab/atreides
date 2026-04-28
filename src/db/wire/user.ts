import { defineEntity, column, SchemaDefinition } from '@enxoval/db';

export class UserDbWire {
  id!: string;
  name!: string;
  email!: string;
  password_hash!: string;
  email_verified!: boolean;
  role!: string;
  created_at!: Date;

  static parse(data: unknown): UserDbWire {
    return Object.assign(new UserDbWire(), data);
  }
}

export const UserSchema: SchemaDefinition<UserDbWire> = defineEntity(UserDbWire, {
  tableName: 'users',
  columns: {
    id: column.primaryUuid(),
    name: column.varchar(),
    email: column.varcharUnique(),
    password_hash: column.varchar(),
    email_verified: column.boolean(false),
    role: column.varchar(),
    created_at: column.createdAt(),
  },
});
