import { Router } from 'express';
import { addReply, createDiscussion, deleteDiscussion, deleteReply, getDiscussion, listDiscussions } from '../controllers/discussionController.js';
import { listArticles, getArticle } from '../controllers/articleController.js';
import { currentWeather, forecastWeather, weatherStatus } from '../controllers/weatherController.js';
import { authenticate } from '../middleware/authenticate.js';

/** Router komunitas (login wajib). */
export const discussionRouter = Router();
discussionRouter.use(authenticate);
discussionRouter.route('/').get(listDiscussions).post(createDiscussion);
discussionRouter.route('/:id').get(getDiscussion).delete(deleteDiscussion);
discussionRouter.post('/:id/replies', addReply);
discussionRouter.delete('/:id/replies/:replyId', deleteReply);

/** Router artikel publik. */
export const articleRouter = Router();
articleRouter.get('/', listArticles);
articleRouter.get('/:id', getArticle);

/** Router cuaca (login wajib agar kuota API key tidak disalahgunakan). */
export const weatherRouter = Router();
weatherRouter.use(authenticate);
weatherRouter.get('/status', weatherStatus);
weatherRouter.get('/current', currentWeather);
weatherRouter.get('/forecast', forecastWeather);

