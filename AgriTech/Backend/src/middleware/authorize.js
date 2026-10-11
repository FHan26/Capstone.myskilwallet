import { ApiError } from '../utils/http.js';

/** Membatasi akses berdasarkan peran. Gunakan setelah `authenticate`. */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Silakan login terlebih dahulu.'));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Anda tidak memiliki izin untuk mengakses fitur ini.'));
  }
  next();
};

