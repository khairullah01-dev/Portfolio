import { createMessage, deleteMessage, findMessages } from '../models/messageModel.js';
import { cleanText } from '../utils/text.js';

export const create = async (request, response) => {
  const name = cleanText(request.body.name);
  const email = cleanText(request.body.email).toLowerCase();
  const subject = cleanText(request.body.subject) || 'No subject';
  const message = cleanText(request.body.message);
  if (!name || !email || !message) return response.status(400).json({ message: 'Name, email, and message are required' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return response.status(400).json({ message: 'Please provide a valid email address' });
  await createMessage({ name, email, subject, message });
  return response.status(201).json({ message: 'Message sent successfully' });
};

export const getMessages = async (_request, response) => response.json(await findMessages());
export const remove = async (request, response) => {
  if (!await deleteMessage(request.params.id)) return response.status(404).json({ message: 'Message not found' });
  return response.json({ message: 'Message deleted' });
};
