import Discussion from '../models/Discussion.js';
import { ApiError, assertObjectId, asyncHandler, buildPagination, escapeRegex, getPagination, pick, sendSuccess } from '../utils/http.js';

const AUTHOR = 'name role';

function visibleFor(user, discussion) {
  const isAdmin = user.role === 'admin';
  const d = discussion.toObject ? discussion.toObject() : discussion;
  d.replies = (d.replies || []).filter((r) => isAdmin || !r.isHidden);
  return d;
}

/** GET /api/discussions?q=&category=&mine=true&page= */
export const listDiscussions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const isAdmin = req.user.role === 'admin';
  const filter = {};
  if (!isAdmin) filter.$or = [{ status: 'Aktif' }, { userId: req.user._id }];
  if (isAdmin && req.query.status) filter.status = String(req.query.status);
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.mine === 'true') filter.userId = req.user._id;
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$and = [{ $or: [{ title: rx }, { content: rx }] }];
  }
  const [items, total] = await Promise.all([
    Discussion.find(filter).populate('userId', AUTHOR).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Discussion.countDocuments(filter),
  ]);
  const data = items.map(({ replies = [], ...d }) => ({ ...d, replyCount: replies.filter((r) => isAdmin || !r.isHidden).length }));
  sendSuccess(res, { data, pagination: buildPagination(page, limit, total) });
});

/** GET /api/discussions/:id */
export const getDiscussion = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID diskusi');
  const d = await Discussion.findById(req.params.id).populate('userId', AUTHOR).populate('replies.userId', AUTHOR);
  const isOwner = d && String(d.userId?._id) === String(req.user._id);
  if (!d || (d.status !== 'Aktif' && req.user.role !== 'admin' && !isOwner)) throw new ApiError(404, 'Diskusi tidak ditemukan.');
  sendSuccess(res, { data: visibleFor(req.user, d) });
});

/** POST /api/discussions */
export const createDiscussion = asyncHandler(async (req, res) => {
  const d = await Discussion.create({ ...pick(req.body, ['title', 'content', 'category']), userId: req.user._id });
  await d.populate('userId', AUTHOR);
  sendSuccess(res, { status: 201, data: d, message: 'Pertanyaan berhasil dipublikasikan.' });
});

/** POST /api/discussions/:id/replies */
export const addReply = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID diskusi');
  const d = await Discussion.findById(req.params.id);
  if (!d || (d.status !== 'Aktif' && req.user.role !== 'admin')) throw new ApiError(404, 'Diskusi tidak ditemukan.');
  d.replies.push({ userId: req.user._id, content: req.body?.content });
  await d.save();
  await d.populate([{ path: 'userId', select: AUTHOR }, { path: 'replies.userId', select: AUTHOR }]);
  sendSuccess(res, { status: 201, data: visibleFor(req.user, d), message: 'Balasan berhasil dikirim.' });
});

/** DELETE /api/discussions/:id - pemilik atau admin */
export const deleteDiscussion = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID diskusi');
  const d = await Discussion.findById(req.params.id);
  if (!d) throw new ApiError(404, 'Diskusi tidak ditemukan.');
  if (req.user.role !== 'admin' && String(d.userId) !== String(req.user._id)) throw new ApiError(403, 'Anda hanya dapat menghapus diskusi milik Anda.');
  await d.deleteOne();
  sendSuccess(res, { message: 'Diskusi berhasil dihapus.' });
});

/** DELETE /api/discussions/:id/replies/:replyId - pemilik balasan atau admin */
export const deleteReply = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID diskusi');
  const d = await Discussion.findById(req.params.id);
  const reply = d?.replies.id(req.params.replyId);
  if (!reply) throw new ApiError(404, 'Balasan tidak ditemukan.');
  if (req.user.role !== 'admin' && String(reply.userId) !== String(req.user._id)) throw new ApiError(403, 'Anda hanya dapat menghapus balasan milik Anda.');
  reply.deleteOne();
  await d.save();
  await d.populate([{ path: 'userId', select: AUTHOR }, { path: 'replies.userId', select: AUTHOR }]);
  sendSuccess(res, { data: visibleFor(req.user, d), message: 'Balasan dihapus.' });
});

/* ===== Moderasi admin ===== */

/** PATCH /api/admin/discussions/:id { status } */
export const moderateDiscussion = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID diskusi');
  const { status } = req.body || {};
  if (!['Aktif', 'Disembunyikan'].includes(status)) throw new ApiError(400, 'Status moderasi tidak valid.');
  const d = await Discussion.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('userId', AUTHOR);
  if (!d) throw new ApiError(404, 'Diskusi tidak ditemukan.');
  sendSuccess(res, { data: d, message: status === 'Aktif' ? 'Diskusi ditampilkan kembali.' : 'Diskusi disembunyikan dari komunitas.' });
});

/** PATCH /api/admin/discussions/:id/replies/:replyId { isHidden } */
export const moderateReply = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID diskusi');
  const d = await Discussion.findById(req.params.id);
  const reply = d?.replies.id(req.params.replyId);
  if (!reply) throw new ApiError(404, 'Balasan tidak ditemukan.');
  reply.isHidden = Boolean(req.body?.isHidden);
  await d.save();
  await d.populate([{ path: 'userId', select: AUTHOR }, { path: 'replies.userId', select: AUTHOR }]);
  sendSuccess(res, { data: d, message: reply.isHidden ? 'Balasan disembunyikan.' : 'Balasan ditampilkan kembali.' });
});

