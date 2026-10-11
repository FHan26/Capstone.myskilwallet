import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AUTH_COOKIE } from '../middleware/authenticate.js';
import { ApiError, asyncHandler, pick, requireFields, sendSuccess } from '../utils/http.js';

const SALT_ROUNDS = 12;

export function validatePasswordStrength(password) {
  if (typeof password !== 'string' || password.length < 8) return 'Password minimal 8 karakter.';
  if (password.length > 72) return 'Password maksimal 72 karakter.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Password harus mengandung huruf dan angka.';
  return null;
}

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

function parseDurationMs(value = '1d') {
  const m = /^(\d+)([smhd])$/.exec(String(value).trim());
  if (!m) return 24 * 60 * 60 * 1000;
  const mult = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[m[2]];
  return Number(m[1]) * mult;
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, // tidak dapat dibaca JavaScript -> mengurangi risiko pencurian token via XSS
    secure: isProd, // hanya dikirim lewat HTTPS di produksi
    sameSite: isProd && process.env.CROSS_SITE_COOKIE === 'true' ? 'none' : 'lax',
    path: '/',
  };
}

function issueSession(res, user) {
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn });
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: parseDurationMs(expiresIn) });
}

/** POST /api/auth/register - registrasi publik, selalu sebagai petani. */
export const register = asyncHandler(async (req, res) => {
  requireFields(req.body, { name: 'Nama lengkap', email: 'Email', phone: 'Nomor telepon', address: 'Alamat', password: 'Password', confirmPassword: 'Konfirmasi password' });
  const { password, confirmPassword } = req.body;
  const pwError = validatePasswordStrength(password);
  if (pwError) throw new ApiError(400, pwError, { password: pwError });
  if (password !== confirmPassword) throw new ApiError(400, 'Konfirmasi password tidak sama.', { confirmPassword: 'Konfirmasi password tidak sama.' });

  const data = pick(req.body, ['name', 'email', 'phone', 'address']);
  const exists = await User.exists({ email: String(data.email).toLowerCase().trim() });
  if (exists) throw new ApiError(409, 'Email sudah terdaftar.', { email: 'Email sudah terdaftar.' });

  const requireApproval = process.env.REQUIRE_ADMIN_APPROVAL === 'true';
  // Peran SELALU 'farmer' untuk registrasi publik; nilai role dari klien diabaikan.
  const user = await User.create({
    ...data,
    passwordHash: await hashPassword(password),
    role: 'farmer',
    accountStatus: requireApproval ? 'pending' : 'active',
  });

  if (requireApproval) {
    return sendSuccess(res, { status: 201, data: { user, requiresApproval: true }, message: 'Registrasi berhasil. Akun Anda menunggu persetujuan administrator.' });
  }
  issueSession(res, user);
  sendSuccess(res, { status: 201, data: { user, requiresApproval: false }, message: 'Registrasi berhasil. Selamat datang di AgriTech!' });
});

/** POST /api/auth/login */
export const login = asyncHandler(async (req, res) => {
  requireFields(req.body, { email: 'Email', password: 'Password' });
  const email = String(req.body.email).toLowerCase().trim();
  const user = await User.findOne({ email }).select('+passwordHash');
  // Pesan generik agar tidak membocorkan email mana yang terdaftar
  const invalid = new ApiError(401, 'Email atau password salah.');
  if (!user) {
    await bcrypt.compare(String(req.body.password), '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva');
    throw invalid;
  }
  const ok = await bcrypt.compare(String(req.body.password), user.passwordHash);
  if (!ok) throw invalid;

  if (user.accountStatus === 'pending') throw new ApiError(403, 'Akun Anda masih menunggu persetujuan administrator.');
  if (user.accountStatus === 'suspended') throw new ApiError(403, 'Akun Anda dinonaktifkan. Hubungi administrator.');

  user.lastLoginAt = new Date();
  await user.save();
  issueSession(res, user);
  sendSuccess(res, { data: { user }, message: `Selamat datang kembali, ${user.name}!` });
});

/** POST /api/auth/logout - menghapus cookie sesi. */
export const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE, cookieOptions());
  sendSuccess(res, { message: 'Anda telah keluar.' });
};

/** GET /api/auth/me */
export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: { user: req.user } });
});

