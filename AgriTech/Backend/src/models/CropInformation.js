import mongoose from 'mongoose';

export const CROP_CATEGORIES = ['Tanaman Pangan', 'Hortikultura', 'Sayuran', 'Buah', 'Perkebunan', 'Rempah dan Obat'];

const pestSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Nama hama/penyakit wajib diisi.'], trim: true, maxlength: 100 },
    type: { type: String, enum: { values: ['Hama', 'Penyakit'], message: 'Tipe harus Hama atau Penyakit.' }, default: 'Hama' },
    symptoms: { type: String, trim: true, maxlength: 1000 },
    prevention: { type: String, trim: true, maxlength: 1000 },
    treatment: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: true }
);

const cropInformationSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: [true, 'Nama tanaman wajib diisi.'], trim: true, unique: true, maxlength: 100 },
    scientificName: { type: String, trim: true, maxlength: 100 },
    category: { type: String, enum: { values: CROP_CATEGORIES, message: 'Kategori tidak valid.' }, required: [true, 'Kategori wajib dipilih.'] },
    description: { type: String, required: [true, 'Deskripsi wajib diisi.'], trim: true, maxlength: 3000 },
    imageUrl: { type: String, trim: true, maxlength: 500 },
    growingConditions: { type: String, trim: true, maxlength: 2000 },
    soilRequirements: { type: String, trim: true, maxlength: 2000 },
    plantingGuidance: { type: String, trim: true, maxlength: 3000 },
    growthStages: [{ type: String, trim: true, maxlength: 300 }],
    commonPests: [pestSchema],
    careGuidance: {
      watering: { type: String, trim: true, maxlength: 2000 },
      fertilization: { type: String, trim: true, maxlength: 2000 },
    },
    estimatedGrowingPeriod: { type: String, trim: true, maxlength: 100 },
    harvestPeriod: { type: String, trim: true, maxlength: 300 },
    isDemoData: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('CropInformation', cropInformationSchema);

