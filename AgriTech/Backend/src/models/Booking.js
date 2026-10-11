import mongoose from 'mongoose';

export const BOOKING_STATUSES = ['Menunggu Persetujuan', 'Disetujui', 'Ditolak', 'Selesai', 'Dibatalkan'];

/** Alur status yang diizinkan untuk admin. */
export const BOOKING_TRANSITIONS = {
  'Menunggu Persetujuan': ['Disetujui', 'Ditolak', 'Dibatalkan'],
  Disetujui: ['Selesai', 'Dibatalkan'],
  Ditolak: [],
  Selesai: [],
  Dibatalkan: [],
};

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    serviceName: { type: String, required: [true, 'Layanan wajib dipilih.'], trim: true, maxlength: 120 },
    serviceCategory: { type: String, trim: true },
    bookingDate: { type: Date, required: [true, 'Tanggal booking wajib diisi.'] },
    preferredTime: { type: String, required: [true, 'Waktu yang diinginkan wajib diisi.'], match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Format waktu harus JJ:MM.'] },
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
    location: { type: String, trim: true, maxlength: [300, 'Lokasi maksimal 300 karakter.'] },
    notes: { type: String, trim: true, maxlength: [1000, 'Catatan maksimal 1000 karakter.'] },
    status: { type: String, enum: { values: BOOKING_STATUSES, message: 'Status booking tidak valid.' }, default: 'Menunggu Persetujuan' },
    adminNote: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);

