import api from './axios.js';

export const getPageTree = (spaceId) => api.get(`/spaces/${spaceId}/pages`);
export const createPage = (spaceId, data) => api.post(`/spaces/${spaceId}/pages`, data);
export const getPage = (spaceId, pageId) => api.get(`/spaces/${spaceId}/pages/${pageId}`);
export const updatePage = (spaceId, pageId, data) => api.put(`/spaces/${spaceId}/pages/${pageId}`, data);
export const deletePage = (spaceId, pageId) => api.delete(`/spaces/${spaceId}/pages/${pageId}`);

export const listRevisions = (spaceId, pageId) => api.get(`/spaces/${spaceId}/pages/${pageId}/revisions`);
export const getRevision = (spaceId, pageId, revId) => api.get(`/spaces/${spaceId}/pages/${pageId}/revisions/${revId}`);
export const restoreRevision = (spaceId, pageId, revId) =>
  api.post(`/spaces/${spaceId}/pages/${pageId}/revisions/${revId}/restore`);
