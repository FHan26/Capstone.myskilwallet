import { Router } from 'express';
import { createService, deleteService, listServices, updateService } from '../controllers/serviceController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', optionalAuthenticate, listServices);
router.post('/', authenticate, authorize('admin'), createService);
router.put('/:id', authenticate, authorize('admin'), updateService);
router.delete('/:id', authenticate, authorize('admin'), deleteService);

export default router;

