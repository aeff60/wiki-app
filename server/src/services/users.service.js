import db from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export async function listUsers() {
  return db('users')
    .select('id', 'email', 'name', 'role', 'is_active', 'avatar_url', 'created_at')
    .orderBy('name');
}

export async function updateUser(userId, data) {
  const user = await db('users').where({ id: userId }).first();
  if (!user) throw new ApiError(404, 'User not found');

  const allowed = {};
  if (data.role !== undefined) allowed.role = data.role;
  if (data.name !== undefined) allowed.name = data.name;
  if (data.is_active !== undefined) allowed.is_active = data.is_active;
  allowed.updated_at = new Date();

  const [updated] = await db('users').where({ id: userId }).update(allowed).returning([
    'id', 'email', 'name', 'role', 'is_active', 'avatar_url', 'created_at',
  ]);
  return updated;
}

export async function deactivateUser(userId) {
  const updated = await db('users').where({ id: userId }).update({ is_active: false });
  if (!updated) throw new ApiError(404, 'User not found');
}
