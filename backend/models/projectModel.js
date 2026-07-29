import mongoose from 'mongoose';
import crypto from 'crypto';

const projectSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  title: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  link: { type: String, default: '#' },
  description: { type: String, default: '' },
}, { timestamps: true, versionKey: false });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export const findProjects = () => Project.find().sort({ createdAt: -1 });
export const createProject = (fields) => Project.create(fields);
export const updateProject = (id, fields) => Project.findByIdAndUpdate(id, fields, { new: true, runValidators: true });
export const deleteProject = (id) => Project.findByIdAndDelete(id);
export default Project;
