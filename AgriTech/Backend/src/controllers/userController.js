import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';
import { ApiError, asyncHandler, pick, requireFields, sendSuccess } from '../utils/http.js';
import { hashPassword, validatePasswordStrength } from './authController.js';

/** GET /api/users/me */
export const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: req.user });
});

/** PUT /api/users/me - hanya field profil; email/role/status tidak dapat diubah di sini. */
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = pick(req.body, ['name', 'phone', 'address']);
  Object.assign(req.user, updates);
  await req.user.save();
  sendSuccess(res, { data: req.user, message: 'Profil berhasil diperbarui.' });
});

/** PUT /api/users/me/password */
export const changePassword = asyncHandler(async (req, res) => {
  requireFields(req.body, { currentPassword: 'Password saat ini', newPassword: 'Password baru', confirmPassword: 'Konfirmasi password' });
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user._id).select('+passwordHash');
  if (!(await bcrypt.compare(String(currentPassword), user.passwordHash))) {
    throw new ApiError(400, 'Password saat ini salah.', { currentPassword: 'Password saat ini salah.' });
  }
  const pwError = validatePasswordStrength(newPassword);
  if (pwError) throw new ApiError(400, pwError, { newPassword: pwError });
  if (newPassword !== confirmPassword) throw new ApiError(400, 'Konfirmasi password tidak sama.', { confirmPassword: 'Konfirmasi password tidak sama.' });
  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  sendSuccess(res, { message: 'Password berhasil diubah.' });
});

/** GET /api/users/me/dashboard - ringkasan dashboard petani dari data nyata. */
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();
  const [farmCount, crops, recentOrders, recentBookings, farms] = await Promise.all([
    Farm.countDocuments({ userId }),
    Crop.find({ userId }).populate('farmId', 'farmName').lean(),
    Order.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
    Booking.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('farmId', 'farmName').lean(),
    Farm.find({ userId }).select('farmName city location').lean(),
  ]);

  const activeCrops = crops.filter((c) => c.status !== 'Selesai Panen');
  const upcomingHarvests = activeCrops
    .filter((c) => c.estimatedHarvestDate && new Date(c.estimatedHarvestDate) >= new Date(now.toDateString()))
    .sort((a, b) => new Date(a.estimatedHarvestDate) - new Date(b.estimatedHarvestDate))
    .slice(0, 5)
    .map((c) => ({ _id: c._id, cropName: c.cropName, cropType: c.cropType, farmName: c.farmId?.farmName, estimatedHarvestDate: c.estimatedHarvestDate, status: c.status }));

  const recentActivities = crops
    .flatMap((c) => (c.activityHistory || []).map((a) => ({ ...a, cropId: c._id, cropName: c.cropName, farmName: c.farmId?.farmName })))
    .sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate))
    .slice(0, 6);

  const statusDistribution = Object.entries(
    crops.reduce((acc, c) => ({ ...acc, [c.status]: (acc[c.status] || 0) + 1 }), {})
  ).map(([name, value]) => ({ name, value }));

  // Jumlah aktivitas per jenis selama 30 hari terakhir
  const since = new Date(now.getTime() - 30 * 864e5);
  const activityCounts = crops
    .flatMap((c) => c.activityHistory || [])
    .filter((a) => new Date(a.activityDate) >= since)
    .reduce((acc, a) => ({ ...acc, [a.activityType]: (acc[a.activityType] || 0) + 1 }), {});
  const activityByType = Object.entries(activityCounts).map(([name, total]) => ({ name, total }));

  sendSuccess(res, {
    data: {
      stats: {
        farmCount,
        activeCropCount: activeCrops.length,
        totalCropCount: crops.length,
        pendingOrders: await Order.countDocuments({ userId, status: 'Menunggu Konfirmasi' }),
        pendingBookings: await Booking.countDocuments({ userId, status: 'Menunggu Persetujuan' }),
      },
      upcomingHarvests,
      recentActivities,
      recentOrders,
      recentBookings,
      statusDistribution,
      activityByType,
      farms,
    },
  });
});

