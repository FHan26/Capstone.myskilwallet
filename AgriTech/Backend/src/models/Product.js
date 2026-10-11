import mongoose from 'mongoose';

export const PRODUCT_CATEGORIES = ['Benih dan Bibit', 'Pupuk', 'Pestisida dan Proteksi Tanaman', 'Peralatan Pertanian', 'Perlengkapan Irigasi'];
export const PRODUCT_STATUSES = ['Tersedia', 'Habis', 'Nonaktif'];

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: [true, 'Nama produk wajib diisi.'], trim: true, maxlength: [120, 'Nama produk maksimal 120 karakter.'] },
    description: { type: String, required: [true, 'Deskripsi produk wajib diisi.'], trim: true, maxlength: [3000, 'Deskripsi maksimal 3000 karakter.'] },
    category: { type: String, enum: { values: PRODUCT_CATEGORIES, message: 'Kategori produk tidak valid.' }, required: [true, 'Kategori wajib dipilih.'] },
    price: { type: Number, required: [true, 'Harga wajib diisi.'], min: [0, 'Harga tidak boleh negatif.'], max: [1000000000, 'Harga terlalu besar.'] },
    stock: {
      type: Number,
      required: [true, 'Stok wajib diisi.'],
      min: [0, 'Stok tidak boleh negatif.'],
      validate: { validator: Number.isInteger, message: 'Stok harus bilangan bulat.' },
    },
    unit: { type: String, trim: true, default: 'pcs', maxlength: 20 },
    imageUrl: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: { values: PRODUCT_STATUSES, message: 'Status produk tidak valid.' }, default: 'Tersedia' },
  },
  { timestamps: true }
);

/** Menyesuaikan status otomatis berdasarkan stok (kecuali produk dinonaktifkan admin). */
export function syncProductStatus(product) {
  if (product.status === 'Nonaktif') return;
  product.status = product.stock > 0 ? 'Tersedia' : 'Habis';
}

productSchema.pre('save', function () {
  syncProductStatus(this);
});

export default mongoose.model('Product', productSchema);

