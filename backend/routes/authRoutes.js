import { Router } from 'express';
import { getProfile, login } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/login', login);
router.get('/profile', requireAdmin, getProfile);
export default router;
