import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import User from './models/userModel.js';
import Project from './models/projectModel.js';
import Experience from './models/experienceModel.js';
import Message from './models/messageModel.js';

import Contact from './models/contactModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
const source = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'db.json'), 'utf8').replace(/^\uFEFF/, ''));

try {
  await connectDB();
  const seedCollection = async (Model, records, filterFor) => {
    if (!records || !records.length) return;
    await Model.bulkWrite(records.map((item) => ({ updateOne: { filter: filterFor(item), update: { $setOnInsert: item }, upsert: true } })));
  };
  await seedCollection(User, source.users, (item) => ({ username: item.username }));
  await seedCollection(Project, source.projects, (item) => ({ _id: item._id }));
  await seedCollection(Experience, source.experience, (item) => ({ _id: item._id }));
  await seedCollection(Message, source.messages, (item) => ({ _id: item._id }));
  if (source.contact) {
    const existing = await Contact.findOne();
    if (!existing) {
      await Contact.create(source.contact);
    }
  }
  console.log('MongoDB seed completed.');
  process.exit(0);
} catch (error) {
  console.error(`MongoDB seed failed: ${error.message}`);
  process.exit(1);
}
