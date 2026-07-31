import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (fileBuffer, originalName, mimeType, folder = 'portfolio') => {
  const safeName = String(originalName || 'upload').replace(/[^a-zA-Z0-9._-]/g, '-');
  const isPdf = mimeType === 'application/pdf'
    || mimeType === 'application/x-pdf'
    || safeName.toLowerCase().endsWith('.pdf');
  const resourceType = isPdf ? 'raw' : 'image';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: `${Date.now()}-${safeName}`,
        access_mode: 'public',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !(imageUrl.includes('res.cloudinary.com') || imageUrl.includes('cloudinary.com'))) return;

  try {
    const urlWithoutQuery = imageUrl.split('?')[0];
    const pathAfterUpload = urlWithoutQuery.split('/upload/')[1];
    if (!pathAfterUpload) return;

    const segments = pathAfterUpload.split('/');
    const startIndex = segments[0]?.startsWith('v') ? 1 : 0;
    const publicId = segments.slice(startIndex).join('/').replace(/\.[^/.]+$/, '');

    if (!publicId) return;

    const resourceType = urlWithoutQuery.toLowerCase().endsWith('.pdf') ? 'raw' : 'image';
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete failed:', error.message);
  }
};

export default cloudinary;
