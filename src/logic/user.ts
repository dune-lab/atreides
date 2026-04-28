import { createHash } from 'node:crypto';
import { fn } from '@enxoval/types';
import { UserInput, ROLES } from '../model/user';
import { createSchema, field } from '@enxoval/types';

const BuildUserInput = createSchema({
  name: field.string(),
  email: field.string(),
  passwordHash: field.string(),
  role: field.literal(...ROLES),
});

export const buildUser = fn(BuildUserInput, UserInput, (input) => ({
  name: input.name,
  email: input.email,
  passwordHash: input.passwordHash,
  emailVerified: false,
  role: input.role,
}));

export async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex');
}
