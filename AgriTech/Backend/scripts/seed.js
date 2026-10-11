/**
 * Mengisi data demonstrasi awal (informasi tanaman, produk, layanan, artikel).
 * Tidak membuat akun pengguna. Data yang sudah ada TIDAK ditimpa kecuali memakai --reset.
 *
 *   npm run seed            -> hanya menambahkan bila koleksi masih kosong
 *   npm run seed -- --reset -> menghapus data demo lama lalu mengisi ulang
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import CropInformation from '../src/models/CropInformation.js';
import Product from '../src/models/Product.js';
import Service from '../src/models/Service.js';
import Article from '../src/models/Article.js';
import { articles, cropInformation, products, services } from './seedData.js';

export async function seedDatabase({ reset = false, log = console.log } = {}) {
  const sets = [
    [CropInformation, cropInformation, 'informasi tanaman'],
    [Product, products, 'produk'],
    [Service, services, 'layanan'],
    [Article, articles, 'artikel'],
  ];
  for (const [Model, rows, label] of sets) {
    if (reset) await Model.deleteMany({});
    const count = await Model.countDocuments();
    if (count > 0) {
      log(`[seed] Lewati ${label}: sudah ada ${count} data.`);
      continue;
    }
    // create() agar hook pre-save (mis. status stok produk) ikut berjalan
    for (const row of rows) await Model.create(row);
    log(`[seed] ${rows.length} ${label} demonstrasi ditambahkan.`);
  }
}

const isDirect = process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/seed.js');
if (isDirect) {
  connectDB()
    .then(() => seedDatabase({ reset: process.argv.includes('--reset') }))
    .then(() => console.log('[seed] Selesai.'))
    .catch((err) => {
      console.error('[seed] Gagal:', err.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

