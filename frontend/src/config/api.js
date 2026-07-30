const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = envApiBaseUrl || 'https://portfolio-backend-kg.vercel.app/api';

export const getUploadUrl = (imagePath) => {
  if (!imagePath?.startsWith('/uploads/')) return imagePath;
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${apiOrigin}${imagePath}`;
};
