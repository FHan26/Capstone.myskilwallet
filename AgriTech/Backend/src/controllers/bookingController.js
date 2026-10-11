import Booking, { BOOKING_STATUSES, BOOKING_TRANSITIONS } from '../models/Booking.js';
import Service from '../models/Service.js';
import { ApiError, assertObjectId, asyncHandler, buildPagination, escapeRegex, getPagination, requireFields, sendSuccess } from '../utils/http.js';
import { findOwnFarm } from './farmController.js';

/** GET /api/bookings - booking milik user */
export const listMyBookings = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.status) filter.status = String(req.query.status);
  const items = await Booking.find(filter).populate('farmId', 'farmName location').sort({ createdAt: -1 }).lean();
  sendSuccess(res, { data: items });
});

/** POST /api/bookings { serviceId, bookingDate, preferredTime, farmId?, location?, notes } */
export const createBooking = asyncHandler(async (req, res) => {
  requireFields(req.body, { serviceId: 'Layanan', bookingDate: 'Tanggal booking', preferredTime: 'Waktu' });
  const { serviceId, bookingDate, preferredTime, farmId, location, notes } = req.body;
  assertObjectId(serviceId, 'ID layanan');
  const service = await Service.findOne({ _id: serviceId, isActive: true });
  if (!service) throw new ApiError(400, 'Layanan tidak tersedia.', { serviceId: 'Layanan tidak tersedia.' });

  const date = new Date(bookingDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(date.getTime())) throw new ApiError(400, 'Tanggal booking tidak valid.', { bookingDate: 'Tanggal booking tidak valid.' });
  if (date < today) throw new ApiError(400, 'Tanggal booking tidak boleh di masa lalu.', { bookingDate: 'Tanggal booking tidak boleh di masa lalu.' });

  let farm = null;
  if (farmId) farm = await findOwnFarm(farmId, req.user._id);
  if (!farm && !String(location || '').trim()) {
    throw new ApiError(400, 'Pilih kebun atau isi lokasi layanan.', { location: 'Pilih kebun atau isi lokasi layanan.' });
  }

  const booking = await Booking.create({
    userId: req.user._id,
    serviceId: service._id,
    serviceName: service.name,
    serviceCategory: service.category,
    bookingDate: date,
    preferredTime,
    farmId: farm?._id,
    location: farm ? farm.location : location,
    notes,
    status: 'Menunggu Persetujuan', // selalu menunggu; tidak pernah otomatis disetujui
  });
  sendSuccess(res, { status: 201, data: booking, message: 'Booking berhasil diajukan dan menunggu persetujuan admin.' });
});

/** PATCH /api/bookings/:id/cancel */
export const cancelMyBooking = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID booking');
  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
  if (!booking) throw new ApiError(404, 'Booking tidak ditemukan.');
  if (!['Menunggu Persetujuan', 'Disetujui'].includes(booking.status)) throw new ApiError(400, `Booking berstatus "${booking.status}" tidak dapat dibatalkan.`);
  booking.status = 'Dibatalkan';
  await booking.save();
  sendSuccess(res, { data: booking, message: 'Booking berhasil dibatalkan.' });
});

/* ===================== Admin ===================== */

/** GET /api/admin/bookings?status=&q=&page= */
export const adminListBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const filter = {};
  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.q) filter.serviceName = new RegExp(escapeRegex(req.query.q), 'i');
  const [items, total] = await Promise.all([
    Booking.find(filter).populate('userId', 'name email phone').populate('farmId', 'farmName location').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Booking.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, pagination: buildPagination(page, limit, total) });
});

/** PATCH /api/admin/bookings/:id/status { status, adminNote } */
export const adminUpdateBookingStatus = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID booking');
  const { status, adminNote } = req.body || {};
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking tidak ditemukan.');
  if (status && status !== booking.status) {
    if (!BOOKING_STATUSES.includes(status)) throw new ApiError(400, 'Status booking tidak valid.');
    if (!BOOKING_TRANSITIONS[booking.status].includes(status)) throw new ApiError(400, `Status tidak dapat diubah dari "${booking.status}" menjadi "${status}".`);
    booking.status = status;
  }
  if (adminNote !== undefined) booking.adminNote = adminNote;
  await booking.save();
  await booking.populate([{ path: 'userId', select: 'name email phone' }, { path: 'farmId', select: 'farmName location' }]);
  sendSuccess(res, { data: booking, message: 'Booking berhasil diperbarui.' });
});

