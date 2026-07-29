import { cleanText } from '../utils/text.js';
import { removeUpload } from '../middleware/uploadMiddleware.js';
import { findContact, upsertContact } from '../models/contactModel.js';

const defaultContact = {
  heroName: 'Khairullah',
  heroBio: 'Passionate developer crafting modern, high-performance web applications.',
  skillsTitle: 'Front-end developer',
  skillsBio: 'Specializing in building clean, responsive, and high-performance web applications using modern technologies.',
  experienceBio: 'Over the years, I have worked with diverse clients and projects delivering top-quality solutions.',
  projectsBio: 'Explore a selection of recent web applications and projects built with cutting-edge technologies.',
  phone: '+99 999999999',
  email: 'myemail@eamil.com',
  linkedin: '',
  facebook: '',
  twitter: '',
  instagram: '',
  picture: '',
  resume: '',
  skillsImage1: '',
  skillsImage2: '',
  skillsImage3: '',
};

export const getContact = async (_request, response) => {
  const contact = await findContact();
  if (!contact) {
    return response.json(defaultContact);
  }
  // Fill missing fields with defaults
  const contactObj = contact.toObject ? contact.toObject() : contact;
  return response.json({ ...defaultContact, ...contactObj });
};

export const saveContact = async (request, response) => {
  const {
    heroName,
    heroBio,
    skillsTitle,
    skillsBio,
    experienceBio,
    projectsBio,
    phone,
    email,
    linkedin,
    facebook,
    twitter,
    instagram,
  } = request.body;

  const cleaned = {
    heroName: cleanText(heroName || ''),
    heroBio: cleanText(heroBio || ''),
    skillsTitle: cleanText(skillsTitle || ''),
    skillsBio: cleanText(skillsBio || ''),
    experienceBio: cleanText(experienceBio || ''),
    projectsBio: cleanText(projectsBio || ''),
    phone: cleanText(phone || ''),
    email: cleanText(email || ''),
    linkedin: cleanText(linkedin || ''),
    facebook: cleanText(facebook || ''),
    twitter: cleanText(twitter || ''),
    instagram: cleanText(instagram || ''),
  };

  const contact = await upsertContact(cleaned);
  return response.json(contact);
};

export const uploadContactPicture = async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: 'Picture file is required' });
  }

  const existingContact = await findContact();
  const picture = `/uploads/${request.file.filename}`;
  const contact = await upsertContact({ picture });

  if (existingContact?.picture && existingContact.picture !== picture) {
    removeUpload(existingContact.picture);
  }

  return response.json(contact);
};

export const uploadContactResume = async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: 'Resume file is required' });
  }

  const existingContact = await findContact();
  const resume = `/uploads/${request.file.filename}`;
  const contact = await upsertContact({ resume });

  if (existingContact?.resume && existingContact.resume !== resume) {
    removeUpload(existingContact.resume);
  }

  return response.json(contact);
};

export const uploadSkillsImage = async (request, response) => {
  const index = request.params.num;
  if (!['1', '2', '3'].includes(index)) {
    return response.status(400).json({ message: 'Invalid image number (must be 1, 2, or 3)' });
  }

  if (!request.file) {
    return response.status(400).json({ message: 'Image file is required' });
  }

  const fieldName = `skillsImage${index}`;
  const existingContact = await findContact();
  const imagePath = `/uploads/${request.file.filename}`;
  const contact = await upsertContact({ [fieldName]: imagePath });

  if (existingContact?.[fieldName] && existingContact[fieldName] !== imagePath) {
    removeUpload(existingContact[fieldName]);
  }

  return response.json(contact);
};
