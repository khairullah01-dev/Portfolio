import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { findUserByUsername } from '../models/userModel.js';
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

export const changePassword = async (request, response) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = request.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return response.status(400).json({ message: 'Current password, new password, and confirmation are required.' });
    }

    if (String(newPassword).length < 6) {
      return response.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    if (String(newPassword) !== String(confirmPassword)) {
      return response.status(400).json({ message: 'New password and confirmation do not match.' });
    }

    const adminUser = await User.findById(request.admin.id);

    if (!adminUser) {
      return response.status(404).json({ message: 'Admin user not found.' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(String(currentPassword), adminUser.password);

    if (!isCurrentPasswordValid) {
      return response.status(401).json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(String(newPassword), 10);
    adminUser.password = hashedPassword;
    await adminUser.save();

    return response.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing admin password:', error);
    return response.status(500).json({ message: 'Failed to update password.' });
  }
};
