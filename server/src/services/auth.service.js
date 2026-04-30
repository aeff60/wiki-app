import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { signToken } from '../config/jwt.js';
import { ApiError } from '../utils/ApiError.js';

export async function register({ email, password, name }) {
  const existing = await db('users').where({ email }).first();
  if (existing) throw new ApiError(409, 'Email already registered');

  const password_hash = await bcrypt.hash(password, 12);
  const [user] = await db('users').insert({ email, password_hash, name }).returning('*');

  const { password_hash: _, ...safeUser } = user;
  const token = signToken({ sub: user.id, role: user.role });
  return { user: safeUser, token };
}

export async function login({ email, password }) {
  const user = await db('users').where({ email, is_active: true }).first();
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const { password_hash: _, ...safeUser } = user;
  const token = signToken({ sub: user.id, role: user.role });
  return { user: safeUser, token };
}
