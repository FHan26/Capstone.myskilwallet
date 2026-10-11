import mongoose from 'mongoose';

export const ROLES = ['farmer', 'admin'];
export const ACCOUNT_STATUSES = ['pending', 'active', 'suspended'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Nama lengkap wajib diisi.'], trim: true, minlength: [3, 'Nama minimal 3 karakter.'], maxlength: [100, 'Nama maksimal 100 karakter.'] },
    email: {
      type: String,
      required: [true, 'Email wajib diisi.'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Format email tidak valid.'],
    },
    phone: { type: String, required: [false, 'Nomor telepon wajib diisi.'], trim: true, match: [/^(\+62|62|0)8[0-9]{7,12}$/, 'Nomor telepon tidak valid (contoh: 081234567890).'] },
    address: { type: String, required: [false, 'Alamat wajib diisi.'], trim: true, maxlength: [300, 'Alamat maksimal 300 karakter.'] },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'farmer' },
    accountStatus: { type: String, enum: ACCOUNT_STATUSES, default: 'active' },
    isVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Tidak pernah mengembalikan hash password di respons JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);

