import api from './axios.js';

export const uploadFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
