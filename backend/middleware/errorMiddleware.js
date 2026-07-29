import multer from 'multer';

export const notFound = (_request, response) => response.status(404).json({ message: 'Route not found' });

export const errorHandler = (error, _request, response, _next) => {
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return response.status(400).json({ message: 'Image must be 5 MB or smaller' });
  }
  return response.status(400).json({ message: error.message || 'Invalid request' });
};
