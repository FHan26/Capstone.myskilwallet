import mongoose from 'mongoose';

export const ORDER_STATUSES = ['Menunggu Konfirmasi', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // Snapshot data produk saat pemesanan agar riwayat tetap akurat bila harga/nama berubah
    productName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String },
    quantity: { type: Number, required: true, min: [1, 'Jumlah minimal 1.'] },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: {
      type: [orderItemSchema],
      validate: { validator: (v) => Array.isArray(v) && v.length > 0, message: 'Pesanan harus berisi minimal 1 produk.' },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    orderDate: { type: Date, default: Date.now },
    deliveryAddress: { type: String, required: [true, 'Alamat pengiriman wajib diisi.'], trim: true, maxlength: [300, 'Alamat maksimal 300 karakter.'] },
    notes: { type: String, trim: true, maxlength: 500 },
    // Tidak ada payment gateway: pembayaran hanya disimulasikan / dilakukan di luar sistem
    paymentMethod: { type: String, default: 'Bayar di Tempat (Simulasi)' },
    paymentStatus: { type: String, enum: ['Belum Dibayar', 'Lunas (Dicatat Manual)'], default: 'Belum Dibayar' },
    status: { type: String, enum: { values: ORDER_STATUSES, message: 'Status pesanan tidak valid.' }, default: 'Menunggu Konfirmasi' },
    adminNote: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    this.orderNumber = `AGT-${ymd}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
});

export default mongoose.model('Order', orderSchema);

