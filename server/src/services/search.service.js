import db from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export async function search(query, { spaceId, limit = 20, offset = 0 }) {
  if (!query?.trim()) throw new ApiError(400, 'Search query is required');

  const q = query.trim();
  const spaceFilter = spaceId ? 'AND p.space_id = ?' : '';
  const bindings = [q, q, q];
  if (spaceId) bindings.push(spaceId);
  bindings.push(true, limit, offset);

  const result = await db.raw(`
    SELECT
      p.id,
      p.title,
      p.slug,
      p.space_id,
      p.updated_at,
      s.name AS space_name,
      s.slug AS space_slug,
      u.name AS author_name,
      ts_rank(p.search_vector, plainto_tsquery('english', ?)) AS rank,
      ts_headline('english', p.content, plainto_tsquery('english', ?),
        'MaxWords=35, MinWords=15, StartSel=<mark>, StopSel=</mark>, HighlightAll=FALSE'
      ) AS excerpt
    FROM pages p
    JOIN spaces s ON s.id = p.space_id
    JOIN users u ON u.id = p.author_id
    WHERE p.search_vector @@ plainto_tsquery('english', ?)
      ${spaceFilter}
      AND p.is_published = ?
    ORDER BY rank DESC
    LIMIT ? OFFSET ?
  `, bindings);

  return result.rows;
}
