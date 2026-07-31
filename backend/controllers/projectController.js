import { createProject, deleteProject, findProjects, updateProject } from '../models/projectModel.js';
import { removeUpload } from '../middleware/uploadMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { cleanText, isHttpUrl } from '../utils/text.js';

const projectFields = async (request, existingImage) => {
  const title = cleanText(request.body.title);
  const link = cleanText(request.body.link) || '#';
  const description = cleanText(request.body.description);
  const imageUrl = cleanText(request.body.image);

  if (request.file) {
    const uploaded = await uploadToCloudinary(request.file.buffer, request.file.originalname, request.file.mimetype, 'portfolio/projects');
    return { title, link, description, image: uploaded.secure_url, imageUrl: uploaded.secure_url };
  }

  return { title, link, description, image: imageUrl || existingImage, imageUrl };
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
  try {
    const fields = await projectFields(request);
    const validationError = validateProject(fields, Boolean(request.file));
    if (validationError) return response.status(400).json({ message: validationError });
    const project = await createProject({ title: fields.title, link: fields.link, description: fields.description, image: fields.image });
    return response.status(201).json(project);
  } catch (error) {
    return response.status(400).json({ message: error.message || 'Failed to upload project image to Cloudinary' });
  }
};

export const update = async (request, response) => {
  try {
    const current = (await findProjects()).find((project) => project._id === request.params.id);
    if (!current) return response.status(404).json({ message: 'Project not found' });
    const fields = await projectFields(request, current.image);
    const validationError = validateProject(fields, Boolean(request.file));
    if (validationError) return response.status(400).json({ message: validationError });
    if (request.file || fields.imageUrl) await removeUpload(current.image);
    return response.json(await updateProject(current._id, { title: fields.title, link: fields.link, description: fields.description, image: fields.image }));
  } catch (error) {
    return response.status(400).json({ message: error.message || 'Failed to update project image to Cloudinary' });
  }
};

export const remove = async (request, response) => {
  const project = await deleteProject(request.params.id);
  if (!project) return response.status(404).json({ message: 'Project not found' });
  await removeUpload(project.image);
  return response.json({ message: 'Project deleted' });
};
