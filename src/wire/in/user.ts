import { createSchema, field } from '@enxoval/types';
import { ROLES } from '../../model/user';

export const CreateUserWireIn = createSchema({
  name: field.string(),
  email: field.string(),
  password: field.string(),
  role: field.literal(...ROLES),
});

export const ConfirmEmailWireIn = createSchema({
  id: field.uuid(),
});
