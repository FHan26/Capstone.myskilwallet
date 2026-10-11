import mongoose from 'mongoose';

/**
 * Menghubungkan aplikasi ke MongoDB menggunakan MONGODB_URI.
 */
export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI belum dikonfigurasi. Salin .env.example menjadi .env dan isi nilainya.');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`[db] Terhubung ke MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

