import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true, versionKey: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export const findUserByUsername = (username) => User.findOne({ username });
export default User;
