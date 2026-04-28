import { createSchema, field } from '@enxoval/types';

export const ROLES = ['student', 'teacher', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export const User = createSchema({
  id: field.uuid(),
  name: field.string(),
  email: field.string(),
  passwordHash: field.string(),
  emailVerified: field.boolean(),
  role: field.literal(...ROLES),
  createdAt: field.date(),
});

export const UserInput = createSchema({
  name: field.string(),
  email: field.string(),
  passwordHash: field.string(),
  emailVerified: field.boolean(),
  role: field.literal(...ROLES),
});

export type User = ReturnType<typeof User.parse>;
export type UserInput = ReturnType<typeof UserInput.parse>;
