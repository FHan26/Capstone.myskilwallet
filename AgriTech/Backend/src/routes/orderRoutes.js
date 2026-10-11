import { Router } from 'express';
import { cancelMyOrder, createOrder, getOrder, listMyOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate);

router.get('/', authorize('farmer'), listMyOrders);
router.post('/', authorize('farmer'), createOrder);
router.get('/:id', getOrder); // pemilik atau admin (dicek di controller)
router.patch('/:id/cancel', authorize('farmer'), cancelMyOrder);

export default router;

