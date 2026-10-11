import { Router } from 'express';
import { cancelMyBooking, createBooking, listMyBookings } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate, authorize('farmer'));

router.route('/').get(listMyBookings).post(createBooking);
router.patch('/:id/cancel', cancelMyBooking);

export default router;

