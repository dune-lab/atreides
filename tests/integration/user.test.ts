import { test, describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, generate } from '@enxoval/testing';
import { TestDataSource } from './helpers/data-source';

test.mock('../../src/db/data-source', () => ({ AppDataSource: TestDataSource }));
test.mock('@enxoval/messaging', () => ({
  publish: test.fn(),
  connect: test.fn(),
  disconnect: test.fn(),
}));

import { buildApp } from '../../src/app';
import { inject } from '@enxoval/http';
import { publish } from '@enxoval/messaging';
import { AppDataSource } from '../../src/db/data-source';
import { UserDbWire } from '../../src/db/wire/user';
import { CreateUserWireIn } from '../../src/wire/in/user';

const validBody = generate(CreateUserWireIn);

beforeAll(async () => {
  await TestDataSource.initialize();
  buildApp();
});

afterAll(async () => {
  await TestDataSource.destroy();
});

beforeEach(() => {
  test.clearAll();
});

afterEach(async () => {
  await AppDataSource.getRepository(UserDbWire).clear();
});

describe('POST /users', () => {
  it('returns 201 with user fields (no passwordHash)', async () => {
    const res = await inject({ method: 'POST', url: '/users', body: validBody });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe(validBody.name);
    expect(body.email).toBe(validBody.email);
    expect(body.emailVerified).toBe(false);
    expect(body.role).toBe(validBody.role);
    expect(body.createdAt).toBeDefined();
    expect(body.passwordHash).toBeUndefined();
  });

  it('inserts user in the database', async () => {
    await inject({ method: 'POST', url: '/users', body: validBody });

    const users = await AppDataSource.getRepository(UserDbWire).find();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe(validBody.name);
    expect(users[0].email).toBe(validBody.email);
    expect(users[0].email_verified).toBe(false);
    expect(users[0].role).toBe(validBody.role);
    expect(users[0].password_hash).not.toBe(validBody.password);
  });

  it('is idempotent — second call with same email returns existing user', async () => {
    const res1 = await inject({ method: 'POST', url: '/users', body: validBody });
    const res2 = await inject({ method: 'POST', url: '/users', body: validBody });

    expect(res1.json().id).toBe(res2.json().id);
    const users = await AppDataSource.getRepository(UserDbWire).find();
    expect(users).toHaveLength(1);
  });

  it('publishes userCreated with correct payload', async () => {
    await inject({ method: 'POST', url: '/users', body: validBody });

    expect(publish).toHaveBeenCalledOnce();
    const [topic, payload] = (publish as ReturnType<typeof test.fn>).mock.calls[0];
    expect(topic).toBe('userCreated');
    expect(payload.userId).toBeDefined();
    expect(payload.email).toBe(validBody.email);
    expect(payload.role).toBe(validBody.role);
  });

  it('does not publish on duplicate email', async () => {
    await inject({ method: 'POST', url: '/users', body: validBody });
    await inject({ method: 'POST', url: '/users', body: validBody });

    expect(publish).toHaveBeenCalledOnce();
  });

  it('returns 400 on missing name', async () => {
    const res = await inject({ method: 'POST', url: '/users', body: { email: 'alice@example.com', password: 'x', role: 'student' } });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 on invalid role', async () => {
    const res = await inject({ method: 'POST', url: '/users', body: { name: 'Alice', email: 'alice@example.com', password: 'x', role: 'superadmin' } });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /users/confirm-email', () => {
  it('sets emailVerified to true', async () => {
    const created = await inject({ method: 'POST', url: '/users', body: validBody });
    const { id } = created.json();

    const res = await inject({ method: 'POST', url: '/users/confirm-email', body: { id } });

    expect(res.statusCode).toBe(201);
    expect(res.json().emailVerified).toBe(true);
  });

  it('persists emailVerified in the database', async () => {
    const created = await inject({ method: 'POST', url: '/users', body: validBody });
    const { id } = created.json();

    await inject({ method: 'POST', url: '/users/confirm-email', body: { id } });

    const user = await AppDataSource.getRepository(UserDbWire).findOneByOrFail({ id });
    expect(user.email_verified).toBe(true);
  });

  it('publishes mailConfirmed with correct payload', async () => {
    const created = await inject({ method: 'POST', url: '/users', body: validBody });
    const { id } = created.json();
    test.clearAll();

    await inject({ method: 'POST', url: '/users/confirm-email', body: { id } });

    expect(publish).toHaveBeenCalledOnce();
    const [topic, payload] = (publish as ReturnType<typeof test.fn>).mock.calls[0];
    expect(topic).toBe('mailConfirmed');
    expect(payload.userId).toBe(id);
    expect(payload.email).toBe(validBody.email);
  });

  it('returns 400 on missing id', async () => {
    const res = await inject({ method: 'POST', url: '/users/confirm-email', body: {} });
    expect(res.statusCode).toBe(400);
  });
});

describe('POST /users/authenticate', () => {
  it('returns 200 with id, email, role (no passwordHash) for valid credentials', async () => {
    await inject({ method: 'POST', url: '/users', body: validBody });

    const res = await inject({ method: 'POST', url: '/users/authenticate', body: { email: validBody.email, password: validBody.password } });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.id).toBeDefined();
    expect(body.email).toBe(validBody.email);
    expect(body.role).toBe(validBody.role);
    expect(body.passwordHash).toBeUndefined();
  });

  it('returns 401 for wrong password', async () => {
    await inject({ method: 'POST', url: '/users', body: validBody });

    const res = await inject({ method: 'POST', url: '/users/authenticate', body: { email: validBody.email, password: 'wrongpassword' } });

    expect(res.statusCode).toBe(401);
  });

  it('returns 401 for non-existent email', async () => {
    const res = await inject({ method: 'POST', url: '/users/authenticate', body: { email: 'ghost@example.com', password: 'secret123' } });

    expect(res.statusCode).toBe(401);
  });
});

describe('GET /users', () => {
  it('returns empty array when no users', async () => {
    const res = await inject({ method: 'GET', url: '/users' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it('returns list of users after insertion', async () => {
    const secondUser = generate(CreateUserWireIn);
    await inject({ method: 'POST', url: '/users', body: validBody });
    await inject({ method: 'POST', url: '/users', body: secondUser });

    const res = await inject({ method: 'GET', url: '/users' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveLength(2);
    expect(body.every((u: { passwordHash?: string }) => u.passwordHash === undefined)).toBe(true);
  });
});
