import { Router } from 'express';
import { addActivity, createCrop, deleteActivity, deleteCrop, getCrop, listCrops, updateCrop } from '../controllers/cropController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate, authorize('farmer'));

router.route('/').get(listCrops).post(createCrop);
router.route('/:id').get(getCrop).put(updateCrop).delete(deleteCrop);
router.post('/:id/activities', addActivity);
router.delete('/:id/activities/:activityId', deleteActivity);

export default router;

