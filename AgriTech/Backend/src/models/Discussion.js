import mongoose from 'mongoose';

export const DISCUSSION_CATEGORIES = ['Tanya Ahli', 'Diskusi Umum', 'Hama dan Penyakit', 'Budidaya', 'Pemasaran Hasil', 'Teknologi Pertanian'];

const replySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: [true, 'Isi balasan wajib diisi.'], trim: true, minlength: [2, 'Balasan terlalu pendek.'], maxlength: [2000, 'Balasan maksimal 2000 karakter.'] },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Judul wajib diisi.'], trim: true, minlength: [8, 'Judul minimal 8 karakter.'], maxlength: [150, 'Judul maksimal 150 karakter.'] },
    content: { type: String, required: [true, 'Isi pertanyaan wajib diisi.'], trim: true, minlength: [15, 'Isi minimal 15 karakter.'], maxlength: [5000, 'Isi maksimal 5000 karakter.'] },
    category: { type: String, enum: { values: DISCUSSION_CATEGORIES, message: 'Kategori tidak valid.' }, default: 'Diskusi Umum' },
    status: { type: String, enum: ['Aktif', 'Disembunyikan'], default: 'Aktif' },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model('Discussion', discussionSchema);

