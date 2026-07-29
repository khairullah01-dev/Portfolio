import { Router } from 'express';
import { create, getExperience, remove, update } from '../controllers/experienceController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', getExperience);
router.post('/', requireAdmin, create);
router.put('/:id', requireAdmin, update);
router.delete('/:id', requireAdmin, remove);
export default router;
