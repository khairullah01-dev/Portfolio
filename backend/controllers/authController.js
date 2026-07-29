import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../models/userModel.js';
import { cleanText } from '../utils/text.js';

export const login = async (request, response) => {
  const user = await findUserByUsername(cleanText(request.body.username));
  const password = request.body.password || '';

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET || 'change-this-development-secret',
    { expiresIn: '8h' },
  );
  return response.json({ token, user: { id: user._id, username: user.username } });
};

export const getProfile = (request, response) => response.json({
  id: request.admin.id,
  username: request.admin.username,
});
