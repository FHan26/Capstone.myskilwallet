import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { ApiError, assertObjectId, asyncHandler, buildPagination, escapeRegex, getPagination, pick, sendSuccess } from '../utils/http.js';

const FIELDS = ['productName', 'description', 'category', 'price', 'stock', 'unit', 'imageUrl', 'status'];

/** GET /api/products?q=&category=&status=&page=&limit=  (publik; produk Nonaktif hanya terlihat oleh admin) */
export const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 12);
  const filter = {};
  const isAdmin = req.user?.role === 'admin';
  if (!isAdmin) filter.status = { $ne: 'Nonaktif' };
  if (req.query.status && isAdmin) filter.status = String(req.query.status);
  if (req.query.q) filter.productName = new RegExp(escapeRegex(req.query.q), 'i');
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.lowStock === 'true' && isAdmin) filter.stock = { $lte: 10 };
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, pagination: buildPagination(page, limit, total) });
});

/** GET /api/products/:id */
export const getProduct = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID produk');
  const product = await Product.findById(req.params.id).lean();
  if (!product || (product.status === 'Nonaktif' && req.user?.role !== 'admin')) throw new ApiError(404, 'Produk tidak ditemukan.');
  sendSuccess(res, { data: product });
});

/** POST /api/products (admin) */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(pick(req.body, FIELDS));
  sendSuccess(res, { status: 201, data: product, message: 'Produk berhasil ditambahkan.' });
});

/** PUT /api/products/:id (admin) */
export const updateProduct = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID produk');
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Produk tidak ditemukan.');
  const data = pick(req.body, FIELDS);
  // Bila admin mengaktifkan kembali produk, status akan disesuaikan dengan stok
  if (data.status && data.status !== 'Nonaktif') data.status = 'Tersedia';
  Object.assign(product, data);
  await product.save();
  sendSuccess(res, { data: product, message: 'Produk berhasil diperbarui.' });
});

/** DELETE /api/products/:id (admin). Produk yang sudah pernah dipesan sebaiknya dinonaktifkan. */
export const deleteProduct = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID produk');
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Produk tidak ditemukan.');
  const activeOrders = await Order.countDocuments({ 'items.productId': product._id, status: { $in: ['Menunggu Konfirmasi', 'Diproses', 'Dikirim'] } });
  if (activeOrders > 0) {
    throw new ApiError(409, `Produk masih ada dalam ${activeOrders} pesanan aktif. Nonaktifkan produk sebagai gantinya.`);
  }
  await product.deleteOne();
  sendSuccess(res, { message: `Produk "${product.productName}" berhasil dihapus.` });
});

