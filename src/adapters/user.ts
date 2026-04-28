import { fn, asUUID } from '@enxoval/types';
import { User, UserInput, Role } from '../model/user';
import { UserDbWire } from '../db/wire/user';

export const fromDbWire = fn(UserDbWire, User, (wire) => ({
  id: asUUID(wire.id),
  name: wire.name,
  email: wire.email,
  passwordHash: wire.password_hash,
  emailVerified: wire.email_verified,
  role: wire.role as Role,
  createdAt: wire.created_at,
}));

export const toDbWire = fn(UserInput, UserDbWire, (input) => {
  const row = new UserDbWire();
  row.name = input.name;
  row.email = input.email;
  row.password_hash = input.passwordHash;
  row.email_verified = input.emailVerified;
  row.role = input.role;
  return row;
});
