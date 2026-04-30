import * as searchService from '../services/search.service.js';

export async function search(req, res, next) {
  try {
    const { q, spaceId, page = 1, limit = 20 } = req.query;
    const results = await searchService.search(q, {
      spaceId,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
}
