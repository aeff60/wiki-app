import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../config/db.js', () => {
  const mockDb = vi.fn();
  return { default: mockDb };
});

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn(),
  },
}));

vi.mock('../../config/jwt.js', () => ({
  signToken: vi.fn().mockReturnValue('mock_token'),
}));

const { register, login } = await import('../../services/auth.service.js');
const { default: db } = await import('../../config/db.js');
const { default: bcrypt } = await import('bcryptjs');

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('throws 409 when email is already taken', async () => {
      db.mockReturnValue({
        where: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue({ id: 'existing-id', email: 'taken@test.com' }),
        insert: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      });

      await expect(
        register({ email: 'taken@test.com', password: 'Password1!', name: 'Test' }),
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('creates a new user and returns a token on success', async () => {
      const fakeUser = {
        id: 'new-uuid',
        email: 'new@test.com',
        name: 'New User',
        role: 'viewer',
        password_hash: 'hashed_password',
        is_active: true,
      };

      // First db('users') call: check existing → null
      db.mockReturnValueOnce({
        where: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(null),
      });
      // Second db('users') call: insert → fakeUser
      db.mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([fakeUser]),
      });

      const result = await register({
        email: 'new@test.com',
        password: 'Password1!',
        name: 'New User',
      });

      expect(result.token).toBe('mock_token');
      expect(result.user.email).toBe('new@test.com');
      expect(result.user.password_hash).toBeUndefined();
    });
  });

  // ── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('throws 401 for an unknown email', async () => {
      db.mockReturnValue({
        where: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(null),
      });

      await expect(
        login({ email: 'ghost@test.com', password: 'any' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('throws 401 when password is incorrect', async () => {
      db.mockReturnValue({
        where: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue({
          id: '1',
          email: 'user@test.com',
          password_hash: 'hashed',
          is_active: true,
        }),
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        login({ email: 'user@test.com', password: 'wrong' }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('returns user (without password_hash) and token on valid credentials', async () => {
      const fakeUser = {
        id: '1',
        email: 'user@test.com',
        name: 'User',
        role: 'viewer',
        password_hash: 'hashed',
        is_active: true,
      };
      db.mockReturnValue({
        where: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue(fakeUser),
      });
      bcrypt.compare.mockResolvedValue(true);

      const result = await login({ email: 'user@test.com', password: 'correct' });

      expect(result.token).toBe('mock_token');
      expect(result.user.email).toBe('user@test.com');
      expect(result.user.password_hash).toBeUndefined();
    });
  });
});
