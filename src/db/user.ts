import { AppDataSource } from './data-source';
import { UserDbWire } from './wire/user';
import { fromDbWire, toDbWire } from '../adapters/user';
import { User, UserInput } from '../model/user';

const repo = () => AppDataSource.getRepository(UserDbWire);

export async function findByEmail(email: string): Promise<User | null> {
  const row = await repo().findOneBy({ email });
  return row ? fromDbWire(row) : null;
}

export async function findById(id: string): Promise<User | null> {
  const row = await repo().findOneBy({ id });
  return row ? fromDbWire(row) : null;
}

export async function findAll(): Promise<User[]> {
  const rows = await repo().find();
  return rows.map(fromDbWire);
}

export async function insert(input: UserInput): Promise<User> {
  const row = await repo().save(repo().create(toDbWire(input)));
  return fromDbWire(row);
}

export async function updateEmailVerified(id: string, verified: boolean): Promise<void> {
  await repo().update(id, { email_verified: verified });
}
