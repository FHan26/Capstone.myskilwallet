import mongoose from 'mongoose';

export const ARTICLE_CATEGORIES = ['Budidaya', 'Teknologi Pertanian', 'Pengendalian Hama', 'Pengelolaan Tanah', 'Pascapanen', 'Tips Petani'];

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul artikel wajib diisi.'], trim: true, maxlength: 200 },
    category: { type: String, enum: { values: ARTICLE_CATEGORIES, message: 'Kategori artikel tidak valid.' }, required: [true, 'Kategori wajib dipilih.'] },
    summary: { type: String, required: [true, 'Ringkasan wajib diisi.'], trim: true, maxlength: 500 },
    content: { type: String, required: [true, 'Isi artikel wajib diisi.'], trim: true, maxlength: 20000 },
    imageUrl: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: { values: ['Draf', 'Terbit'], message: 'Status artikel tidak valid.' }, default: 'Draf' },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Article', articleSchema);

