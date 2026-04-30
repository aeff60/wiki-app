import api from './axios.js';

export const search = (q, { spaceId, page, limit } = {}) => {
  const params = { q };
  if (spaceId) params.spaceId = spaceId;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  return api.get('/search', { params });
};
