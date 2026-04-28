import { asyncFn } from '@enxoval/types';
import { publish } from '@enxoval/messaging';
import { User } from '../model/user';
import { CreateUserWireIn, ConfirmEmailWireIn } from '../wire/in/user';
import { buildUser, hashPassword } from '../logic/user';
import * as userDb from '../db/user';

export const createUser = asyncFn(CreateUserWireIn, User, async (input) => {
  const existing = await userDb.findByEmail(input.email);
  if (existing) return existing;

  const passwordHash = await hashPassword(input.password);
  const user = await userDb.insert(buildUser({ name: input.name, email: input.email, passwordHash, role: input.role }));

  await publish('userCreated', { userId: user.id, email: user.email, role: user.role });
  return user;
});

export const confirmEmail = asyncFn(ConfirmEmailWireIn, User, async (input) => {
  const user = await userDb.findById(input.id);
  if (!user) throw new Error('User not found: ' + input.id);

  await userDb.updateEmailVerified(input.id, true);
  const updated = { ...user, emailVerified: true };

  await publish('mailConfirmed', { userId: user.id, email: user.email });
  return updated;
});
