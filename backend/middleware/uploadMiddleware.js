import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

import { deleteFromCloudinary } from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isServerlessWritableRuntime = Boolean(process.env.VERCEL);

export const uploadsPath = isServerlessWritableRuntime
  ? path.join('/tmp', 'portfolio-uploads')
  : path.join(__dirname, '..', 'uploads');

fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => callback(null, file.mimetype.startsWith('image/')),
});

export const uploadPdf = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    const isPdfMime = file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf';
    const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';
    callback(null, isPdfMime || isPdfExt);
  },
});

export const removeUpload = async (image) => {
  if (!image || typeof image !== 'string') return;

  if (image.startsWith('/uploads/')) {
    const filepath = path.join(uploadsPath, path.basename(image));
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    return;
  }

  if (image.includes('cloudinary.com')) {
    await deleteFromCloudinary(image);
  }
};
