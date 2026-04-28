import { fn } from '@enxoval/types';
import { post } from '@enxoval/http';
import { CreateUserWireIn, ConfirmEmailWireIn } from '../../wire/in/user';
import { UserWireOut } from '../../wire/out/user';
import { User } from '../../model/user';
import { createUser, confirmEmail } from '../../controllers/user';

const toWireOut = fn(User, UserWireOut, (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  emailVerified: u.emailVerified,
  role: u.role,
  createdAt: u.createdAt.toISOString(),
}));

export function registerUserRoutes(): void {
  post('/users', async (body) => {
    const input = CreateUserWireIn.parse(body);
    const user = await createUser(input);
    return toWireOut(user);
  });

  post('/users/confirm-email', async (body) => {
    const input = ConfirmEmailWireIn.parse(body);
    const user = await confirmEmail(input);
    return toWireOut(user);
  });
}
