/**
 * tests/unit/user/adapters.test.ts
 *
 * Unit tests for the user adapter functions (fromDbWire and toDbWire).
 * Uses generate() for random field values (fromDbWire) and itCases() for
 * property-based invariant checks over many random UserInput values (toDbWire).
 */

import { describe, it, itCases, generate, expect } from '@enxoval/testing';
import { fromDbWire, toDbWire } from '../../../src/adapters/user';
import { UserDbWire } from '../../../src/db/wire/user';
import { User, UserInput } from '../../../src/model/user';

describe('user adapter — fromDbWire', () => {
  it('maps snake_case db columns to camelCase model', () => {
    const generated = generate(User);

    const wire = new UserDbWire();
    wire.id = generated.id;
    wire.name = generated.name;
    wire.email = generated.email;
    wire.password_hash = generated.passwordHash;
    wire.email_verified = generated.emailVerified;
    wire.role = generated.role;
    wire.created_at = new Date();

    const result = fromDbWire(wire);

    expect(result.id).toBe(wire.id);
    expect(result.name).toBe(wire.name);
    expect(result.email).toBe(wire.email);
    expect(result.passwordHash).toBe(wire.password_hash);
    expect(result.emailVerified).toBe(wire.email_verified);
    expect(result.role).toBe(wire.role);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

describe('user adapter — toDbWire', () => {
  itCases('returns a UserDbWire instance', UserInput, (input) => {
    const result = toDbWire(input);
    expect(result).toBeInstanceOf(UserDbWire);
  });

  itCases('maps all fields correctly', UserInput, (input) => {
    const result = toDbWire(input);
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.password_hash).toBe(input.passwordHash);
    expect(result.email_verified).toBe(input.emailVerified);
    expect(result.role).toBe(input.role);
  });

  itCases('does not set id (delegated to DB)', UserInput, (input) => {
    const result = toDbWire(input);
    expect(result.id).toBeUndefined();
  });

  itCases('does not set created_at (delegated to DB)', UserInput, (input) => {
    const result = toDbWire(input);
    expect(result.created_at).toBeUndefined();
  });
});
