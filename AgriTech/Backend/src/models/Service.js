import mongoose from 'mongoose';

export const SERVICE_CATEGORIES = ['Sewa Alat Pertanian', 'Konsultasi Ahli', 'Bantuan Pertanian'];

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Nama layanan wajib diisi.'], trim: true, maxlength: 120 },
    category: { type: String, enum: { values: SERVICE_CATEGORIES, message: 'Kategori layanan tidak valid.' }, required: [true, 'Kategori layanan wajib dipilih.'] },
    description: { type: String, required: [true, 'Deskripsi layanan wajib diisi.'], trim: true, maxlength: 2000 },
    estimatedPrice: { type: Number, min: [0, 'Harga tidak boleh negatif.'], default: 0 },
    priceUnit: { type: String, trim: true, default: 'per hari', maxlength: 40 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);

