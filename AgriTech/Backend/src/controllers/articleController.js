import Article from '../models/Article.js';
import { ApiError, assertObjectId, asyncHandler, buildPagination, escapeRegex, getPagination, pick, sendSuccess } from '../utils/http.js';

const FIELDS = ['title', 'category', 'summary', 'content', 'imageUrl', 'status'];

/** GET /api/articles - publik, hanya artikel terbit. Admin: /api/admin/articles */
export const listArticles = asyncHandler(async (req, res) => {
  const adminView = req.adminView === true;
  const { page, limit, skip } = getPagination(req.query, adminView ? 10 : 9);
  const filter = adminView ? {} : { status: 'Terbit' };
  if (adminView && req.query.status) filter.status = String(req.query.status);
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.q) filter.title = new RegExp(escapeRegex(req.query.q), 'i');
  const [items, total] = await Promise.all([
    Article.find(filter).select(adminView ? '' : '-content').populate('authorId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, pagination: buildPagination(page, limit, total) });
});

export const getArticle = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID artikel');
  const item = await Article.findById(req.params.id).populate('authorId', 'name').lean();
  if (!item || (item.status !== 'Terbit' && req.adminView !== true)) throw new ApiError(404, 'Artikel tidak ditemukan.');
  sendSuccess(res, { data: item });
});

export const createArticle = asyncHandler(async (req, res) => {
  const item = await Article.create({ ...pick(req.body, FIELDS), authorId: req.user._id });
  sendSuccess(res, { status: 201, data: item, message: 'Artikel berhasil dibuat.' });
});

export const updateArticle = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID artikel');
  const item = await Article.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Artikel tidak ditemukan.');
  Object.assign(item, pick(req.body, FIELDS));
  item.isDemoData = false;
  await item.save();
  sendSuccess(res, { data: item, message: 'Artikel berhasil diperbarui.' });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID artikel');
  const item = await Article.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Artikel tidak ditemukan.');
  sendSuccess(res, { message: 'Artikel berhasil dihapus.' });
});

