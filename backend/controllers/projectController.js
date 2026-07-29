import { createProject, deleteProject, findProjects, updateProject } from '../models/projectModel.js';
import { removeUpload } from '../middleware/uploadMiddleware.js';
import { cleanText, isHttpUrl } from '../utils/text.js';

const projectFields = (request, existingImage) => {
  const title = cleanText(request.body.title);
  const link = cleanText(request.body.link) || '#';
  const description = cleanText(request.body.description);
  const imageUrl = cleanText(request.body.image);
  const image = request.file ? `/uploads/${request.file.filename}` : imageUrl || existingImage;
  return { title, link, description, image, imageUrl };
};

const validateProject = ({ title, link, image, imageUrl }, hasUpload) => {
  if (!title) return 'Title is required';
  if (!image) return 'An image is required';
  if (!hasUpload && imageUrl && !isHttpUrl(imageUrl)) return 'Image URL must be valid';
  if (link !== '#' && !isHttpUrl(link)) return 'Project link must be a valid URL';
  return null;
};

export const getProjects = async (_request, response) => response.json(await findProjects());

export const create = async (request, response) => {
  const fields = projectFields(request);
  const validationError = validateProject(fields, Boolean(request.file));
  if (validationError) return response.status(400).json({ message: validationError });
  const project = await createProject({ title: fields.title, link: fields.link, description: fields.description, image: fields.image });
  return response.status(201).json(project);
};

export const update = async (request, response) => {
  const current = (await findProjects()).find((project) => project._id === request.params.id);
  if (!current) return response.status(404).json({ message: 'Project not found' });
  const fields = projectFields(request, current.image);
  const validationError = validateProject(fields, Boolean(request.file));
  if (validationError) return response.status(400).json({ message: validationError });
  if (request.file || fields.imageUrl) removeUpload(current.image);
  return response.json(await updateProject(current._id, { title: fields.title, link: fields.link, description: fields.description, image: fields.image }));
};

export const remove = async (request, response) => {
  const project = await deleteProject(request.params.id);
  if (!project) return response.status(404).json({ message: 'Project not found' });
  removeUpload(project.image);
  return response.json({ message: 'Project deleted' });
};
