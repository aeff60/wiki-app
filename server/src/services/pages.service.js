import db from '../config/db.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';
import { ApiError } from '../utils/ApiError.js';

function buildTree(pages) {
  const map = {};
  const roots = [];
  for (const p of pages) {
    map[p.id] = { ...p, children: [] };
  }
  for (const p of pages) {
    if (p.parent_id && map[p.parent_id]) {
      map[p.parent_id].children.push(map[p.id]);
    } else {
      roots.push(map[p.id]);
    }
  }
  return roots;
}

async function upsertTags(pageId, tagNames) {
  await db('page_tags').where({ page_id: pageId }).delete();
  if (!tagNames?.length) return;

  for (const name of tagNames) {
    const slug = slugify(name);
    let tag = await db('tags').where({ slug }).first();
    if (!tag) {
      [tag] = await db('tags').insert({ name, slug }).returning('*');
    }
    await db('page_tags').insert({ page_id: pageId, tag_id: tag.id }).onConflict().ignore();
  }
}

async function getPageTags(pageId) {
  return db('tags')
    .join('page_tags', 'tags.id', 'page_tags.tag_id')
    .where('page_tags.page_id', pageId)
    .select('tags.*');
}

async function snapshotRevision(page, authorId, changeSummary) {
  const count = await db('page_revisions').where({ page_id: page.id }).count('id as n').first();
  const revision_number = parseInt(count.n) + 1;
  await db('page_revisions').insert({
    page_id: page.id,
    title: page.title,
    content: page.content,
    author_id: authorId,
    revision_number,
    change_summary: changeSummary || null,
  });
}

export async function getPageTree(spaceId) {
  const pages = await db('pages')
    .where({ space_id: spaceId })
    .select('id', 'parent_id', 'title', 'slug', 'is_published', 'view_count', 'created_at', 'updated_at', 'author_id')
    .orderBy('title');
  return buildTree(pages);
}

export async function createPage(spaceId, authorId, { title, content, parent_id, is_published, tags, change_summary }) {
  const slug = await uniqueSlug(title, (s) =>
    db('pages').where({ space_id: spaceId, slug: s }).first()
  );

  const [page] = await db('pages').insert({
    space_id: spaceId,
    parent_id: parent_id || null,
    title,
    slug,
    content: content || '',
    author_id: authorId,
    is_published: is_published || false,
  }).returning('*');

  await upsertTags(page.id, tags);
  await snapshotRevision(page, authorId, change_summary || 'Initial version');

  return { ...page, tags: await getPageTags(page.id) };
}

export async function getPage(spaceId, pageId) {
  const page = await db('pages').where({ id: pageId, space_id: spaceId }).first();
  if (!page) throw new ApiError(404, 'Page not found');

  await db('pages').where({ id: pageId }).increment('view_count', 1);

  const tags = await getPageTags(pageId);
  const author = await db('users').where({ id: page.author_id }).select('id', 'name', 'avatar_url').first();

  return { ...page, tags, author };
}

export async function updatePage(pageId, userId, { title, content, parent_id, is_published, tags, change_summary }) {
  const page = await db('pages').where({ id: pageId }).first();
  if (!page) throw new ApiError(404, 'Page not found');

  await snapshotRevision(page, userId, change_summary);

  const updates = { updated_at: new Date() };
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (parent_id !== undefined) updates.parent_id = parent_id;
  if (is_published !== undefined) updates.is_published = is_published;

  if (title && title !== page.title) {
    updates.slug = await uniqueSlug(title, (s) =>
      db('pages').where({ space_id: page.space_id, slug: s }).whereNot({ id: pageId }).first()
    );
  }

  const [updated] = await db('pages').where({ id: pageId }).update(updates).returning('*');
  if (tags !== undefined) await upsertTags(pageId, tags);

  return { ...updated, tags: await getPageTags(pageId) };
}

export async function deletePage(pageId) {
  const deleted = await db('pages').where({ id: pageId }).delete();
  if (!deleted) throw new ApiError(404, 'Page not found');
}

export async function listRevisions(pageId) {
  return db('page_revisions')
    .where({ page_id: pageId })
    .join('users', 'page_revisions.author_id', 'users.id')
    .select('page_revisions.*', 'users.name as author_name')
    .orderBy('page_revisions.revision_number', 'desc');
}

export async function getRevision(revisionId) {
  const revision = await db('page_revisions').where({ id: revisionId }).first();
  if (!revision) throw new ApiError(404, 'Revision not found');
  return revision;
}

export async function restoreRevision(pageId, revisionId, userId) {
  const revision = await db('page_revisions').where({ id: revisionId, page_id: pageId }).first();
  if (!revision) throw new ApiError(404, 'Revision not found');

  return updatePage(pageId, userId, {
    title: revision.title,
    content: revision.content,
    change_summary: `Restored to revision #${revision.revision_number}`,
  });
}
