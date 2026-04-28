import { describe, it, expect } from '@enxoval/testing';
import { buildUser, hashPassword } from '../../../src/logic/user';

describe('buildUser', () => {
  it('sets emailVerified to false', () => {
    const result = buildUser({ name: 'Alice', email: 'alice@example.com', passwordHash: 'hash', role: 'student' });
    expect(result.emailVerified).toBe(false);
  });

  it('carries all fields through', () => {
    const result = buildUser({ name: 'Alice', email: 'alice@example.com', passwordHash: 'hash', role: 'admin' });
    expect(result.name).toBe('Alice');
    expect(result.email).toBe('alice@example.com');
    expect(result.passwordHash).toBe('hash');
    expect(result.role).toBe('admin');
  });

  it('does not generate id', () => {
    const result = buildUser({ name: 'Alice', email: 'alice@example.com', passwordHash: 'hash', role: 'student' });
    expect((result as Record<string, unknown>).id).toBeUndefined();
  });
});

describe('hashPassword', () => {
  it('returns a non-empty string', async () => {
    const hash = await hashPassword('secret');
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('returns a deterministic sha256 hex string', async () => {
    const hash1 = await hashPassword('secret');
    const hash2 = await hashPassword('secret');
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('produces different hashes for different passwords', async () => {
    const h1 = await hashPassword('secret');
    const h2 = await hashPassword('other');
    expect(h1).not.toBe(h2);
  });
});
