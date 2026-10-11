import { ApiError } from '../utils/http.js';

/** 404 untuk route API yang tidak dikenal. */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`));
};

/**
 * Proteksi CSRF ringan: permintaan yang mengubah data wajib membawa header
 * X-Requested-With. Form lintas-situs tidak dapat menambahkan header kustom, dan
 * fetch lintas-origin dengan header kustom akan diblokir oleh preflight CORS.
 */
export const requireAjaxHeader = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.get('X-Requested-With') !== 'XMLHttpRequest') {
    return next(new ApiError(403, 'Permintaan ditolak (header keamanan tidak ditemukan).'));
  }
  next();
};

/** Penanganan error terpusat dengan format JSON yang konsisten. */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server.';
  let errors = err instanceof ApiError && err.errors ? err.errors : undefined;

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Data tidak valid. Periksa kembali isian Anda.';
    errors = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.kind === 'cast' ? 'Format nilai tidak valid.' : v.message]));
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Nilai untuk "${err.path}" tidak valid.`;
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field === 'email' ? 'Email sudah terdaftar.' : `Data dengan ${field} tersebut sudah ada.`;
    if (field) errors = { [field]: message };
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Format JSON tidak valid.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Ukuran data terlalu besar.';
  }

  if (status >= 500) {
    console.error('[error]', err);
    if (process.env.NODE_ENV === 'production') message = 'Terjadi kesalahan pada server.';
  }

  res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
};
