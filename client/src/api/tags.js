import api from './axios.js';

export const listTags = () => api.get('/tags');
export const createTag = (name) => api.post('/tags', { name });
