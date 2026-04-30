import api from './axios.js';

export const listSpaces = () => api.get('/spaces');
export const createSpace = (data) => api.post('/spaces', data);
export const getSpace = (id) => api.get(`/spaces/${id}`);
export const updateSpace = (id, data) => api.put(`/spaces/${id}`, data);
export const deleteSpace = (id) => api.delete(`/spaces/${id}`);
