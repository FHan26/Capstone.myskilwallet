import { Router } from 'express';
import { changePassword, getDashboard, getProfile, updateProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/me/password', changePassword);
router.get('/me/dashboard', authorize('farmer'), getDashboard);

export default router;

