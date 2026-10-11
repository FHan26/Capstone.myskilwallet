import { Router } from 'express';
import { createCropInfo, deleteCropInfo, getCropInfo, listCropInfo, listPests, updateCropInfo } from '../controllers/cropInformationController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', listCropInfo);
router.get('/pests', listPests);
router.get('/:id', getCropInfo);
router.post('/', authenticate, authorize('admin'), createCropInfo);
router.put('/:id', authenticate, authorize('admin'), updateCropInfo);
router.delete('/:id', authenticate, authorize('admin'), deleteCropInfo);

export default router;

