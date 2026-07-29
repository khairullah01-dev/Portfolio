import mongoose from 'mongoose';
import crypto from 'crypto';

const experienceSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true, trim: true },
}, { versionKey: false });

const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
export const findExperience = () => Experience.find();
export const createExperience = (fields) => Experience.create(fields);
export const updateExperience = (id, fields) => Experience.findByIdAndUpdate(id, fields, { new: true, runValidators: true });
export const deleteExperience = async (id) => Boolean(await Experience.findByIdAndDelete(id));
export default Experience;
