import mongoose from 'mongoose';

export const AREA_UNITS = ['hektare', 'are', 'meter persegi'];
export const IRRIGATION_METHODS = ['Tadah Hujan', 'Irigasi Teknis', 'Irigasi Tetes', 'Sprinkler', 'Pompa Air', 'Lainnya'];

const soilRecordSchema = new mongoose.Schema(
  {
    recordDate: { type: Date, required: [true, 'Tanggal pengamatan wajib diisi.'] },
    ph: { type: Number, min: [0, 'pH minimal 0.'], max: [14, 'pH maksimal 14.'] },
    moisture: { type: String, enum: { values: ['Kering', 'Lembap', 'Basah', 'Tergenang'], message: 'Kelembapan tidak valid.' } },
    fertility: { type: String, enum: { values: ['Rendah', 'Sedang', 'Tinggi', 'Belum Diketahui'], message: 'Tingkat kesuburan tidak valid.' }, default: 'Belum Diketahui' },
    observation: { type: String, trim: true, required: [true, 'Catatan pengamatan wajib diisi.'], maxlength: [1000, 'Catatan maksimal 1000 karakter.'] },
  },
  { timestamps: true }
);

const farmSchema = new mongoose.Schema(
  {
    farmName: { type: String, required: [true, 'Nama kebun wajib diisi.'], trim: true, maxlength: [100, 'Nama kebun maksimal 100 karakter.'] },
    location: { type: String, required: [true, 'Lokasi kebun wajib diisi.'], trim: true, maxlength: [300, 'Lokasi maksimal 300 karakter.'] },
    city: { type: String, trim: true, maxlength: [80, 'Nama kota maksimal 80 karakter.'] },
    farmSize: { type: Number, required: [true, 'Luas kebun wajib diisi.'], min: [0.0001, 'Luas kebun harus lebih dari 0.'], max: [1000000, 'Luas kebun terlalu besar.'] },
    areaUnit: { type: String, enum: { values: AREA_UNITS, message: 'Satuan luas tidak valid.' }, default: 'hektare' },
    irrigationMethod: { type: String, enum: { values: IRRIGATION_METHODS, message: 'Metode irigasi tidak valid.' }, required: [true, 'Metode irigasi wajib dipilih.'] },
    soilType: { type: String, trim: true, maxlength: [60, 'Jenis tanah maksimal 60 karakter.'] },
    notes: { type: String, trim: true, maxlength: [1000, 'Catatan maksimal 1000 karakter.'] },
    soilRecords: [soilRecordSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Farm', farmSchema);

