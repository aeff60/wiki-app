import db from '../config/db.js';
import { slugify } from '../utils/slugify.js';
import { ApiError } from '../utils/ApiError.js';

export async function listTags() {
  return db('tags').orderBy('name');
}

export async function createTag(name) {
  const slug = slugify(name);
  const existing = await db('tags').where({ slug }).first();
  if (existing) throw new ApiError(409, 'Tag already exists');
  const [tag] = await db('tags').insert({ name, slug }).returning('*');
  return tag;
}
