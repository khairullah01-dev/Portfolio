import { createExperience, deleteExperience, findExperience, updateExperience } from '../models/experienceModel.js';
import { cleanText } from '../utils/text.js';

const fields = (request) => ({ title: cleanText(request.body.title), subtitle: cleanText(request.body.subtitle) });
const invalid = ({ title, subtitle }) => !title || !subtitle;

export const getExperience = async (_request, response) => response.json(await findExperience());
export const create = async (request, response) => {
  const values = fields(request);
  if (invalid(values)) return response.status(400).json({ message: 'Title and subtitle are required' });
  return response.status(201).json(await createExperience(values));
};
export const update = async (request, response) => {
  const values = fields(request);
  if (invalid(values)) return response.status(400).json({ message: 'Title and subtitle are required' });
  const item = await updateExperience(request.params.id, values);
  if (!item) return response.status(404).json({ message: 'Stat not found' });
  return response.json(item);
};
export const remove = async (request, response) => {
  if (!await deleteExperience(request.params.id)) return response.status(404).json({ message: 'Stat not found' });
  return response.json({ message: 'Stat deleted' });
};
