import { Router } from 'express';
import { getContact, saveContact, uploadContactPicture, uploadContactResume, uploadSkillsImage } from '../controllers/contactController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { upload, uploadPdf } from '../middleware/uploadMiddleware.js';

const router = Router();
router.get('/', getContact);
router.put('/', requireAdmin, saveContact);
router.post('/picture', requireAdmin, upload.single('picture'), uploadContactPicture);
router.post('/resume', requireAdmin, uploadPdf.single('resume'), uploadContactResume);
router.post('/skills-image/:num', requireAdmin, upload.single('image'), uploadSkillsImage);
export default router;
