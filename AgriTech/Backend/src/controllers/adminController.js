import User, { ACCOUNT_STATUSES } from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import Discussion from '../models/Discussion.js';
import CropInformation from '../models/CropInformation.js';
import { ApiError, assertObjectId, asyncHandler, buildPagination, escapeRegex, getPagination, sendSuccess } from '../utils/http.js';

/** GET /api/admin/stats - seluruh angka dihitung dari database */
export const getStats = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5, 1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [
    totalUsers, totalFarmers, pendingUsers, totalFarms, totalCrops, totalProducts, lowStockProducts,
    pendingOrders, pendingBookings, totalOrders, revenueAgg, ordersByStatus, bookingsByStatus,
    productsByCategory, monthlyOrders, monthlyUsers, recentUsers, recentOrders, recentBookings, cropInfoCount, discussionCount,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ accountStatus: 'pending' }),
    Farm.countDocuments(),
    Crop.countDocuments(),
    Product.countDocuments(),
    Product.find({ stock: { $lte: 10 }, status: { $ne: 'Nonaktif' } }).select('productName stock unit').sort({ stock: 1 }).limit(5).lean(),
    Order.countDocuments({ status: 'Menunggu Konfirmasi' }),
    Booking.countDocuments({ status: 'Menunggu Persetujuan' }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: 'Dibatalkan' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]),
    Booking.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, stock: { $sum: '$stock' } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'Dibatalkan' } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    ]),
    User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, users: { $sum: 1 } } },
    ]),
    User.find().sort({ createdAt: -1 }).limit(5).lean(),
    Order.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(5).lean(),
    Booking.find().populate('userId', 'name').sort({ createdAt: -1 }).limit(5).lean(),
    CropInformation.countDocuments(),
    Discussion.countDocuments(),
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthly = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(sixMonthsAgo);
    d.setMonth(sixMonthsAgo.getMonth() + i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const o = monthlyOrders.find((x) => x._id.y === y && x._id.m === m);
    const u = monthlyUsers.find((x) => x._id.y === y && x._id.m === m);
    monthly.push({ month: `${monthNames[m - 1]} ${String(y).slice(2)}`, orders: o?.orders || 0, revenue: o?.revenue || 0, users: u?.users || 0 });
  }

  const recentActivities = [
    ...recentUsers.map((u) => ({ type: 'user', date: u.createdAt, text: `${u.name} mendaftar sebagai ${u.role === 'admin' ? 'admin' : 'petani'}` })),
    ...recentOrders.map((o) => ({ type: 'order', date: o.createdAt, text: `${o.userId?.name || 'Pengguna'} membuat pesanan ${o.orderNumber}` })),
    ...recentBookings.map((b) => ({ type: 'booking', date: b.createdAt, text: `${b.userId?.name || 'Pengguna'} mengajukan booking ${b.serviceName}` })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  sendSuccess(res, {
    data: {
      totals: { totalUsers, totalFarmers, pendingUsers, totalFarms, totalCrops, totalProducts, pendingOrders, pendingBookings, totalOrders, revenue: revenueAgg[0]?.total || 0, cropInfoCount, discussionCount },
      lowStockProducts,
      ordersByStatus: ordersByStatus.map((s) => ({ name: s._id, value: s.value })),
      bookingsByStatus: bookingsByStatus.map((s) => ({ name: s._id, value: s.value })),
      productsByCategory: productsByCategory.map((p) => ({ name: p._id, count: p.count, stock: p.stock })),
      monthly,
      recentActivities,
      recentOrders,
    },
  });
});

/** GET /api/admin/users?q=&role=&status=&page= */
export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }];
  }
  if (req.query.role) filter.role = String(req.query.role);
  if (req.query.status) filter.accountStatus = String(req.query.status);
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean({ virtuals: false }),
    User.countDocuments(filter),
  ]);
  const ids = items.map((u) => u._id);
  const farmCounts = await Farm.aggregate([{ $match: { userId: { $in: ids } } }, { $group: { _id: '$userId', n: { $sum: 1 } } }]);
  const fc = Object.fromEntries(farmCounts.map((f) => [String(f._id), f.n]));
  // lean() melewati toJSON, jadi pastikan passwordHash tidak ikut (select:false sudah mencegahnya)
  sendSuccess(res, { data: items.map(({ passwordHash, __v, ...u }) => ({ ...u, farmCount: fc[String(u._id)] || 0 })), pagination: buildPagination(page, limit, total) });
});

/** GET /api/admin/users/:id */
export const getUser = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID pengguna');
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Pengguna tidak ditemukan.');
  const [farms, cropCount, orderCount, bookingCount] = await Promise.all([
    Farm.find({ userId: user._id }).select('farmName location farmSize areaUnit').lean(),
    Crop.countDocuments({ userId: user._id }),
    Order.countDocuments({ userId: user._id }),
    Booking.countDocuments({ userId: user._id }),
  ]);
  sendSuccess(res, { data: { user, farms, cropCount, orderCount, bookingCount } });
});

/** PATCH /api/admin/users/:id { accountStatus, isVerified, role } */
export const updateUser = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID pengguna');
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Pengguna tidak ditemukan.');
  const isSelf = String(user._id) === String(req.user._id);
  const { accountStatus, isVerified, role } = req.body || {};

  if (accountStatus !== undefined) {
    if (!ACCOUNT_STATUSES.includes(accountStatus)) throw new ApiError(400, 'Status akun tidak valid.');
    if (isSelf && accountStatus !== 'active') throw new ApiError(400, 'Anda tidak dapat menonaktifkan akun Anda sendiri.');
    user.accountStatus = accountStatus;
  }
  if (isVerified !== undefined) user.isVerified = Boolean(isVerified);
  if (role !== undefined) {
    if (!['farmer', 'admin'].includes(role)) throw new ApiError(400, 'Peran tidak valid.');
    if (isSelf && role !== 'admin') throw new ApiError(400, 'Anda tidak dapat menurunkan peran akun Anda sendiri.');
    user.role = role;
  }
  await user.save();
  sendSuccess(res, { data: user, message: 'Data pengguna berhasil diperbarui.' });
});

/** DELETE /api/admin/users/:id - menghapus pengguna beserta kebun & tanamannya */
export const deleteUser = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID pengguna');
  if (String(req.params.id) === String(req.user._id)) throw new ApiError(400, 'Anda tidak dapat menghapus akun Anda sendiri.');
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Pengguna tidak ditemukan.');
  if (user.role === 'admin' && (await User.countDocuments({ role: 'admin' })) <= 1) throw new ApiError(400, 'Tidak dapat menghapus administrator terakhir.');
  await Promise.all([Farm.deleteMany({ userId: user._id }), Crop.deleteMany({ userId: user._id }), Discussion.deleteMany({ userId: user._id })]);
  await user.deleteOne();
  sendSuccess(res, { message: `Pengguna "${user.name}" berhasil dihapus.` });
});

/** GET /api/admin/farms?q=&page= - ringkasan seluruh kebun (baca saja) */
export const listAllFarms = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(req.query.q), 'i');
    filter.$or = [{ farmName: rx }, { location: rx }];
  }
  const [items, total] = await Promise.all([
    Farm.find(filter).select('-soilRecords').populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Farm.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, pagination: buildPagination(page, limit, total) });
});

