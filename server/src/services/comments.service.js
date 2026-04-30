import db from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export async function listComments(pageId) {
  const rows = await db('comments')
    .where({ page_id: pageId })
    .join('users', 'comments.author_id', 'users.id')
    .select(
      'comments.*',
      'users.name as author_name',
      'users.avatar_url as author_avatar'
    )
    .orderBy('comments.created_at');

  return rows.map((c) => ({
    ...c,
    content: c.is_deleted ? null : c.content,
  }));
}

export async function createComment(pageId, authorId, { content, parent_id }) {
  const [comment] = await db('comments')
    .insert({ page_id: pageId, author_id: authorId, content, parent_id: parent_id || null })
    .returning('*');
  return comment;
}

export async function updateComment(commentId, user, content) {
  const comment = await db('comments').where({ id: commentId }).first();
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (comment.author_id !== user.id && user.role !== 'admin') {
    throw new ApiError(403, 'Cannot edit this comment');
  }
  const [updated] = await db('comments').where({ id: commentId }).update({ content, updated_at: new Date() }).returning('*');
  return updated;
}

export async function deleteComment(commentId, user) {
  const comment = await db('comments').where({ id: commentId }).first();
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (comment.author_id !== user.id && user.role !== 'admin') {
    throw new ApiError(403, 'Cannot delete this comment');
  }
  await db('comments').where({ id: commentId }).update({ is_deleted: true, updated_at: new Date() });
}
