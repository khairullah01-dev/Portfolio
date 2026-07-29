import mongoose from 'mongoose';
import crypto from 'crypto';

const messageSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, default: 'No subject', trim: true },
  message: { type: String, required: true, trim: true },
}, { timestamps: true, versionKey: false });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const findMessages = () => Message.find().sort({ createdAt: -1 });
export const createMessage = (fields) => Message.create(fields);
export const deleteMessage = async (id) => Boolean(await Message.findByIdAndDelete(id));
export default Message;
