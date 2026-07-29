import mongoose from 'mongoose';
import crypto from 'crypto';

const contactSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomUUID() },
  heroName: { type: String, default: 'Khairullah' },
  heroBio: { type: String, default: 'Passionate developer crafting modern, high-performance web applications.' },
  skillsTitle: { type: String, default: 'Front-end developer' },
  skillsBio: { type: String, default: 'Specializing in building clean, responsive, and high-performance web applications using modern technologies.' },
  experienceBio: { type: String, default: 'Over the years, I have worked with diverse clients and projects delivering top-quality solutions.' },
  projectsBio: { type: String, default: 'Explore a selection of recent web applications and projects built with cutting-edge technologies.' },
  phone: { type: String, default: '+99 999999999' },
  email: { type: String, default: 'myemail@eamil.com' },
  linkedin: { type: String, default: '' },
  facebook: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' },
  picture: { type: String, default: '' },
  resume: { type: String, default: '' },
  skillsImage1: { type: String, default: '' },
  skillsImage2: { type: String, default: '' },
  skillsImage3: { type: String, default: '' },
}, { timestamps: true, versionKey: false });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
export const findContact = () => Contact.findOne().sort({ createdAt: -1 });
export const upsertContact = (fields) =>
  Contact.findOneAndUpdate({}, fields, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
export default Contact;
