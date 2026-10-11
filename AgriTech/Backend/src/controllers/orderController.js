import Order, { ORDER_STATUSES } from '../models/Order.js';
import Product, { syncProductStatus } from '../models/Product.js';
import { ApiError, assertObjectId, asyncHandler, buildPagination, escapeRegex, getPagination, sendSuccess } from '../utils/http.js';

const ORDER_TRANSITIONS = {
  'Menunggu Konfirmasi': ['Diproses', 'Dibatalkan'],
  Diproses: ['Dikirim', 'Dibatalkan'],
  Dikirim: ['Selesai'],
  Selesai: [],
  Dibatalkan: [],
};

async function restoreStock(items) {
  for (const it of items) {
    const p = await Product.findByIdAndUpdate(it.productId, { $inc: { stock: it.quantity } }, { new: true });
    if (p) {
      syncProductStatus(p);
      await p.save();
    }
  }
}

/** GET /api/orders - pesanan milik user */
export const listMyOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const filter = { userId: req.user._id };
  if (req.query.status) filter.status = String(req.query.status);
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, pagination: buildPagination(page, limit, total) });
});

/** GET /api/orders/:id - pemilik atau admin */
export const getOrder = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID pesanan');
  const filter = { _id: req.params.id };
  if (req.user.role !== 'admin') filter.userId = req.user._id;
  const order = await Order.findOne(filter).populate('userId', 'name email phone').lean();
  if (!order) throw new ApiError(404, 'Pesanan tidak ditemukan.');
  sendSuccess(res, { data: order });
});

/**
 * POST /api/orders  { items: [{productId, quantity}], deliveryAddress, notes }
 * Harga diambil dari database (bukan dari klien). Stok dikurangi secara atomik.
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, notes } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, 'Keranjang masih kosong.');
  if (items.length > 50) throw new ApiError(400, 'Terlalu banyak item dalam satu pesanan.');
  if (!deliveryAddress || !String(deliveryAddress).trim()) throw new ApiError(400, 'Alamat pengiriman wajib diisi.', { deliveryAddress: 'Alamat pengiriman wajib diisi.' });

  // Gabungkan item duplikat
  const merged = new Map();
  for (const it of items) {
    assertObjectId(it?.productId, 'ID produk');
    const qty = Number(it.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 10000) throw new ApiError(400, 'Jumlah produk harus bilangan bulat minimal 1.');
    merged.set(String(it.productId), (merged.get(String(it.productId)) || 0) + qty);
  }

  const reserved = [];
  try {
    const orderItems = [];
    for (const [productId, quantity] of merged) {
      // Pengurangan stok atomik: hanya berhasil jika stok mencukupi & produk aktif
      const product = await Product.findOneAndUpdate(
        { _id: productId, status: { $ne: 'Nonaktif' }, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!product) {
        const p = await Product.findById(productId).lean();
        if (!p || p.status === 'Nonaktif') throw new ApiError(400, 'Salah satu produk sudah tidak tersedia.');
        throw new ApiError(400, `Stok "${p.productName}" tidak mencukupi (tersisa ${p.stock} ${p.unit || ''}).`.trim());
      }
      reserved.push({ productId, quantity });
      syncProductStatus(product);
      await product.save();
      orderItems.push({ productId, productName: product.productName, price: product.price, unit: product.unit, quantity, subtotal: product.price * quantity });
    }
    const totalAmount = orderItems.reduce((s, i) => s + i.subtotal, 0);
    const order = await Order.create({ userId: req.user._id, items: orderItems, totalAmount, deliveryAddress, notes });
    sendSuccess(res, { status: 201, data: order, message: 'Pesanan berhasil dibuat dan menunggu konfirmasi admin.' });
  } catch (err) {
    if (reserved.length) await restoreStock(reserved);
    throw err;
  }
});

/** PATCH /api/orders/:id/cancel - petani hanya dapat membatalkan pesanan yang belum diproses */
export const cancelMyOrder = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID pesanan');
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) throw new ApiError(404, 'Pesanan tidak ditemukan.');
  if (order.status !== 'Menunggu Konfirmasi') throw new ApiError(400, 'Pesanan yang sudah diproses tidak dapat dibatalkan.');
  order.status = 'Dibatalkan';
  await order.save();
  await restoreStock(order.items);
  sendSuccess(res, { data: order, message: 'Pesanan berhasil dibatalkan.' });
});

/* ===================== Admin ===================== */

/** GET /api/admin/orders?status=&q=&page= */
export const adminListOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 10);
  const filter = {};
  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.q) filter.orderNumber = new RegExp(escapeRegex(req.query.q), 'i');
  const [items, total] = await Promise.all([
    Order.find(filter).populate('userId', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);
  sendSuccess(res, { data: items, pagination: buildPagination(page, limit, total) });
});

/** PATCH /api/admin/orders/:id/status { status, adminNote, paymentStatus } */
export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  assertObjectId(req.params.id, 'ID pesanan');
  const { status, adminNote, paymentStatus } = req.body || {};
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Pesanan tidak ditemukan.');
  if (status && status !== order.status) {
    if (!ORDER_STATUSES.includes(status)) throw new ApiError(400, 'Status pesanan tidak valid.');
    if (!ORDER_TRANSITIONS[order.status].includes(status)) {
      throw new ApiError(400, `Status tidak dapat diubah dari "${order.status}" menjadi "${status}".`);
    }
    order.status = status;
    if (status === 'Dibatalkan') await restoreStock(order.items);
  }
  if (adminNote !== undefined) order.adminNote = adminNote;
  if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
  await order.save();
  await order.populate('userId', 'name email phone');
  sendSuccess(res, { data: order, message: 'Pesanan berhasil diperbarui.' });
});

export { ORDER_TRANSITIONS };

