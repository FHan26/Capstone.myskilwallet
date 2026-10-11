import mongoose from 'mongoose';

/** Error HTTP dengan status code dan detail opsional. */
export class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
  }
}

/** Membungkus handler async agar error diteruskan ke errorHandler. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Respons sukses yang konsisten. */
export function sendSuccess(res, { data = null, message, status = 200, pagination } = {}) {
  const body = { success: true };
  if (message) body.message = message;
  body.data = data;
  if (pagination) body.pagination = pagination;
  return res.status(status).json(body);
}

/** Mengambil hanya field yang diizinkan (mencegah mass-assignment seperti role/userId). */
export function pick(source = {}, fields = []) {
  const out = {};
  for (const f of fields) {
    if (Object.prototype.hasOwnProperty.call(source, f) && source[f] !== undefined) out[f] = source[f];
  }
  return out;
}

/** Parameter pagination dari query string. */
export function getPagination(query, defaultLimit = 10, maxLimit = 100) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
}

export function buildPagination(page, limit, total) {
  return { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) };
}

/** Escape string agar aman dipakai pada RegExp pencarian. */
export function escapeRegex(text = '') {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);
}

export function assertObjectId(id, label = 'ID') {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, `${label} tidak valid.`);
}

/** Validasi sederhana untuk field wajib. */
export function requireFields(body, fields) {
  const errors = {};
  for (const [key, label] of Object.entries(fields)) {
    const v = body?.[key];
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
      errors[key] = `${label} wajib diisi.`;
    }
  }
  if (Object.keys(errors).length) throw new ApiError(400, 'Data yang dikirim belum lengkap.', errors);
}

