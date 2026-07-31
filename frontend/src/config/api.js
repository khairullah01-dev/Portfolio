const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = envApiBaseUrl || (
  import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://portfolio-backend-kg.vercel.app/api'
);

export const getUploadUrl = (imagePath) => {
  if (!imagePath) return imagePath;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (!imagePath.startsWith('/uploads/')) return imagePath;

  if (!import.meta.env.DEV && imagePath.startsWith('/uploads/')) {
    return '';
  }

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${apiOrigin}${imagePath}`;
};
