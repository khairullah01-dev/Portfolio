import { Router } from 'express';
import { create, getMessages, remove } from '../controllers/messageController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', create);
router.get('/', requireAdmin, getMessages);
router.delete('/:id', requireAdmin, remove);
export default router;
