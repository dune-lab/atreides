/**
 * Unit tests for user logic: buildUser and hashPassword.
 * Uses itCases (property-based) and generate from @enxoval/testing
 * to eliminate hardcoded objects.
 */
import { describe, it, itCases, generate, expect } from '@enxoval/testing';
import { createSchema, field } from '@enxoval/types';
import { buildUser, hashPassword } from '../../../src/logic/user';

/** Input schema for buildUser, mirroring the expected parameter shape. */
const BuildUserInput = createSchema({
  name: field.string(),
  email: field.string(),
  passwordHash: field.string(),
  role: field.literal('student', 'teacher', 'admin'),
});

/** Input schema for hashPassword. */
const PasswordInput = createSchema({
  password: field.string(),
});

describe('buildUser', () => {
  itCases('sets emailVerified to false', BuildUserInput, (input) => {
    const result = buildUser(input);
    expect(result.emailVerified).toBe(false);
  });

  itCases('carries all fields through', BuildUserInput, (input) => {
    const result = buildUser(input);
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.passwordHash).toBe(input.passwordHash);
    expect(result.role).toBe(input.role);
  });

  itCases('does not generate id', BuildUserInput, (input) => {
    const result = buildUser(input);
    expect((result as Record<string, unknown>).id).toBeUndefined();
  });
});

describe('hashPassword', () => {
  itCases('returns 64-char hex string', PasswordInput, async (input) => {
    const hash = await hashPassword(input.password);
    expect(hash).toHaveLength(64);
  });

  itCases('is deterministic for the same password', PasswordInput, async (input) => {
    const hash1 = await hashPassword(input.password);
    const hash2 = await hashPassword(input.password);
    expect(hash1).toBe(hash2);
  });

  it('produces different hashes for different passwords', async () => {
    const p = generate(PasswordInput).password;
    expect(await hashPassword(p)).not.toBe(await hashPassword(p + 'x'));
  });
});
