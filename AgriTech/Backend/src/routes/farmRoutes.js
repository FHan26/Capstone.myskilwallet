import { Router } from 'express';
import { addSoilRecord, createFarm, deleteFarm, deleteSoilRecord, getFarm, listFarms, updateFarm } from '../controllers/farmController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate, authorize('farmer'));

router.route('/').get(listFarms).post(createFarm);
router.route('/:id').get(getFarm).put(updateFarm).delete(deleteFarm);
router.post('/:id/soil-records', addSoilRecord);
router.delete('/:id/soil-records/:recordId', deleteSoilRecord);

export default router;

