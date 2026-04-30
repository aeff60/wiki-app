import api from './axios.js';

export const listComments = (pageId) => api.get(`/pages/${pageId}/comments`);
export const createComment = (pageId, data) => api.post(`/pages/${pageId}/comments`, data);
export const updateComment = (pageId, commentId, data) => api.put(`/pages/${pageId}/comments/${commentId}`, data);
export const deleteComment = (pageId, commentId) => api.delete(`/pages/${pageId}/comments/${commentId}`);
