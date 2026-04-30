import db from '../config/db.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';
import { ApiError } from '../utils/ApiError.js';

export async function listSpaces(user) {
  return db('spaces')
    .where(function () {
      this.where('is_public', true).orWhere('created_by', user.id);
      if (user.role === 'admin') this.orWhereRaw('TRUE');
    })
    .orderBy('name');
}

export async function createSpace(userId, { name, description, is_public }) {
  const slug = await uniqueSlug(name, (s) => db('spaces').where({ slug: s }).first());
  const [space] = await db('spaces')
    .insert({ name, slug, description, is_public, created_by: userId })
    .returning('*');
  return space;
}

export async function getSpace(spaceId, user) {
  const space = await db('spaces').where({ id: spaceId }).first();
  if (!space) throw new ApiError(404, 'Space not found');
  if (!space.is_public && space.created_by !== user.id && user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }
  return space;
}

export async function updateSpace(spaceId, data) {
  const space = await db('spaces').where({ id: spaceId }).first();
  if (!space) throw new ApiError(404, 'Space not found');

  const updates = { ...data, updated_at: new Date() };
  if (data.name && data.name !== space.name) {
    updates.slug = await uniqueSlug(data.name, (s) =>
      db('spaces').where({ slug: s }).whereNot({ id: spaceId }).first()
    );
  }

  const [updated] = await db('spaces').where({ id: spaceId }).update(updates).returning('*');
  return updated;
}

export async function deleteSpace(spaceId) {
  const deleted = await db('spaces').where({ id: spaceId }).delete();
  if (!deleted) throw new ApiError(404, 'Space not found');
}
