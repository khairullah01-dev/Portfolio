import { Router } from 'express';
import { create, getProjects, remove, update } from '../controllers/projectController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();
router.get('/', getProjects);
router.post('/', requireAdmin, upload.single('image'), create);
router.put('/:id', requireAdmin, upload.single('image'), update);
router.delete('/:id', requireAdmin, remove);
export default router;
