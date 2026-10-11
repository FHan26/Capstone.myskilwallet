import mongoose from 'mongoose';

export const CROP_STATUSES = ['Persiapan Lahan', 'Penanaman', 'Pertumbuhan', 'Perawatan', 'Siap Panen', 'Selesai Panen'];
export const GROWTH_STAGES = ['Benih', 'Persemaian', 'Vegetatif Awal', 'Vegetatif', 'Generatif', 'Pembungaan', 'Pembuahan', 'Pematangan', 'Panen'];
export const ACTIVITY_TYPES = ['Penanaman', 'Penyiraman', 'Pemupukan', 'Pengamatan Hama', 'Penyemprotan', 'Penyiangan', 'Panen', 'Lainnya'];

const activitySchema = new mongoose.Schema(
  {
    activityType: { type: String, enum: { values: ACTIVITY_TYPES, message: 'Jenis aktivitas tidak valid.' }, required: [true, 'Jenis aktivitas wajib dipilih.'] },
    activityDate: { type: Date, required: [true, 'Tanggal aktivitas wajib diisi.'] },
    description: { type: String, trim: true, required: [true, 'Keterangan aktivitas wajib diisi.'], maxlength: [1000, 'Keterangan maksimal 1000 karakter.'] },
    quantity: { type: Number, min: [0, 'Jumlah tidak boleh negatif.'] },
    unit: { type: String, trim: true, maxlength: 20 },
  },
  { timestamps: true }
);

const cropSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: [true, 'Kebun wajib dipilih.'], index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cropName: { type: String, required: [true, 'Nama tanaman wajib diisi.'], trim: true, maxlength: [100, 'Nama tanaman maksimal 100 karakter.'] },
    cropType: { type: String, required: [true, 'Jenis/varietas tanaman wajib diisi.'], trim: true, maxlength: [100, 'Jenis tanaman maksimal 100 karakter.'] },
    plantingDate: { type: Date, required: [true, 'Tanggal tanam wajib diisi.'] },
    estimatedHarvestDate: {
      type: Date,
      validate: {
        validator(v) {
          if (!v) return true;
          const planting = this.plantingDate || (this.getUpdate && this.getUpdate()?.$set?.plantingDate);
          return !planting || new Date(v) >= new Date(planting);
        },
        message: 'Estimasi panen tidak boleh sebelum tanggal tanam.',
      },
    },
    growthStage: { type: String, enum: { values: GROWTH_STAGES, message: 'Fase pertumbuhan tidak valid.' }, default: 'Benih' },
    status: { type: String, enum: { values: CROP_STATUSES, message: 'Status tanaman tidak valid.' }, default: 'Penanaman' },
    notes: { type: String, trim: true, maxlength: [1000, 'Catatan maksimal 1000 karakter.'] },
    activityHistory: [activitySchema],
  },
  { timestamps: true }
);

export default mongoose.model('Crop', cropSchema);

