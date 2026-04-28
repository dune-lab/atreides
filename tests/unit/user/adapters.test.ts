import { describe, it, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/user';
import { UserDbWire } from '../../../src/db/wire/user';

const userId = '11111111-1111-1111-1111-111111111111';

describe('user adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const wire = new UserDbWire();
    wire.id = userId;
    wire.name = 'Alice';
    wire.email = 'alice@example.com';
    wire.password_hash = 'abc123';
    wire.email_verified = false;
    wire.role = 'student';
    wire.created_at = new Date('2024-01-01');

    expect(fromDbWire(wire)).toEqual({
      id: userId,
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'abc123',
      emailVerified: false,
      role: 'student',
      createdAt: new Date('2024-01-01'),
    });
  });
});

describe('user adapter — toDbWire', () => {
  it('returns a UserDbWire instance', () => {
    const result = toDbWire({ name: 'Alice', email: 'alice@example.com', passwordHash: 'abc123', emailVerified: false, role: 'student' });
    expect(result).toBeInstanceOf(UserDbWire);
  });

  it('maps fields correctly', () => {
    const result = toDbWire({ name: 'Alice', email: 'alice@example.com', passwordHash: 'abc123', emailVerified: false, role: 'teacher' });
    expect(result.name).toBe('Alice');
    expect(result.email).toBe('alice@example.com');
    expect(result.password_hash).toBe('abc123');
    expect(result.email_verified).toBe(false);
    expect(result.role).toBe('teacher');
  });

  it('does not set id (delegated to DB)', () => {
    const result = toDbWire({ name: 'Alice', email: 'alice@example.com', passwordHash: 'abc123', emailVerified: false, role: 'student' });
    expect(result.id).toBeUndefined();
  });

  it('does not set created_at (delegated to DB)', () => {
    const result = toDbWire({ name: 'Alice', email: 'alice@example.com', passwordHash: 'abc123', emailVerified: false, role: 'student' });
    expect(result.created_at).toBeUndefined();
  });
});
