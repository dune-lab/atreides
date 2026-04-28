import { fn } from '@enxoval/types';
import { get } from '@enxoval/http';
import { User } from '../../model/user';
import { UserWireOut } from '../../wire/out/user';
import * as userDb from '../../db/user';

const toWireOut = fn(User, UserWireOut, (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  emailVerified: u.emailVerified,
  role: u.role,
  createdAt: u.createdAt.toISOString(),
}));

export function registerUsersListRoutes(): void {
  get('/users', async () => {
    const users = await userDb.findAll();
    return users.map(toWireOut);
  });
}
