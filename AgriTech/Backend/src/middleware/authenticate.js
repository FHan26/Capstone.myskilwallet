import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/http.js';

export const AUTH_COOKIE = 'agritech_token';

/**
 * Memverifikasi JWT dari cookie httpOnly (atau header Authorization: Bearer sebagai alternatif
 * untuk klien non-browser). Status akun & peran selalu dibaca ulang dari database, sehingga
 * akun yang dinonaktifkan atau diubah perannya langsung berlaku tanpa menunggu token kedaluwarsa.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.[AUTH_COOKIE];
  const header = req.headers.authorization;
  if (!token && header?.startsWith('Bearer ')) token = header.slice(7);
  if (!token) throw new ApiError(401, 'Silakan login terlebih dahulu.');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Sesi Anda telah berakhir. Silakan login kembali.');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, 'Akun tidak ditemukan. Silakan login kembali.');
  if (user.accountStatus !== 'active') {
    throw new ApiError(403, user.accountStatus === 'pending'
      ? 'Akun Anda masih menunggu persetujuan administrator.'
      : 'Akun Anda dinonaktifkan. Hubungi administrator.');
  }
  req.user = user;
  next();
});

/** Seperti authenticate, tetapi tidak menolak permintaan tanpa sesi (untuk endpoint publik). */
export const optionalAuthenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (user && user.accountStatus === 'active') req.user = user;
  } catch {
    /* token tidak valid diabaikan pada endpoint publik */
  }
  next();
});
