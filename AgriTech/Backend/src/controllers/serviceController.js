import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { ApiError, assertObjectId, asyncHandler, pick, sendSuccess } from '../utils/http.js';

const FIELDS = ['name', 'category', 'description', 'estimatedPrice', 'priceUnit', 'isActive'];

/** GET /api/services - layanan aktif (admin melihat semua dengan ?all=true) */
export const listServices = asyncHandler(async (req, res) => {
  const filter = req.user?.role === 'admin' && req.query.all === 'true' ? {} : { isActive: true };
  if (req.query.category) filter.category = String(req.query.category);
  const items = await Service.find(filter).sort({ category: 1, name: 1 }).lean();
  sendSuccess(res, { data: items });
});

export const createService = asyncHandler(async (req, res) => {
  const item = await Service.create(pick(req.body, FIELDS));
  sendSuccess(res, { status: 201, data: item, message: 'Layanan berhasil ditambahkan.' });
});

export const updateService = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID layanan');
  const item = await Service.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Layanan tidak ditemukan.');
  Object.assign(item, pick(req.body, FIELDS));
  await item.save();
  sendSuccess(res, { data: item, message: 'Layanan berhasil diperbarui.' });
});

export const deleteService = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID layanan');
  const item = await Service.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Layanan tidak ditemukan.');
  const active = await Booking.countDocuments({ serviceId: item._id, status: { $in: ['Menunggu Persetujuan', 'Disetujui'] } });
  if (active) throw new ApiError(409, `Layanan masih memiliki ${active} booking aktif. Nonaktifkan layanan sebagai gantinya.`);
  await item.deleteOne();
  sendSuccess(res, { message: `Layanan "${item.name}" berhasil dihapus.` });
});

