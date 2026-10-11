import { Router } from 'express';
import { getStats, listUsers, getUser, updateUser, deleteUser, listAllFarms } from '../controllers/adminController.js';
import { adminListOrders, adminUpdateOrderStatus } from '../controllers/orderController.js';
import { adminListBookings, adminUpdateBookingStatus } from '../controllers/bookingController.js';
import { listArticles, getArticle, createArticle, updateArticle, deleteArticle } from '../controllers/articleController.js';
import { listDiscussions, moderateDiscussion, moderateReply } from '../controllers/discussionController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
// Seluruh endpoint admin wajib login DAN berperan admin
router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);

router.get('/users', listUsers);
router.route('/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

router.get('/farms', listAllFarms);

router.get('/orders', adminListOrders);
router.patch('/orders/:id/status', adminUpdateOrderStatus);

router.get('/bookings', adminListBookings);
router.patch('/bookings/:id/status', adminUpdateBookingStatus);

const adminView = (req, res, next) => {
  req.adminView = true;
  next();
};
router.get('/articles', adminView, listArticles);
router.post('/articles', createArticle);
router.route('/articles/:id').get(adminView, getArticle).put(updateArticle).delete(deleteArticle);

router.get('/discussions', listDiscussions);
router.patch('/discussions/:id', moderateDiscussion);
router.patch('/discussions/:id/replies/:replyId', moderateReply);

export default router;

