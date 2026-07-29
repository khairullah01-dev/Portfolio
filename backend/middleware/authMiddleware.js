import jwt from 'jsonwebtoken';

export const requireAdmin = (request, response, next) => {
  const token = request.headers.authorization?.startsWith('Bearer ')
    ? request.headers.authorization.slice(7)
    : null;

  if (!token) return response.status(401).json({ message: 'Authentication required' });

  try {
    request.admin = jwt.verify(token, process.env.JWT_SECRET || 'change-this-development-secret');
    return next();
  } catch {
    return response.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
};
