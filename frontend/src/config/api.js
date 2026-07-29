export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getUploadUrl = (imagePath) => {
  if (!imagePath?.startsWith('/uploads/')) return imagePath;
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${apiOrigin}${imagePath}`;
};
