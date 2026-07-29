import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsPath = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, uploadsPath),
  filename: (_request, file, callback) => callback(
    null,
    `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`,
  ),
});

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

export const removeUpload = (image) => {
  if (!image?.startsWith('/uploads/')) return;
  const filepath = path.join(uploadsPath, path.basename(image));
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
};
