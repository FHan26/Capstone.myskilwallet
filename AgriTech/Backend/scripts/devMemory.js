/**
 * MODE DEMO TANPA INSTALASI MONGODB.
 * Menjalankan MongoDB sementara di memori (mongodb-memory-server), mengisi data demonstrasi,
 * membuat akun demo, lalu menjalankan API. SEMUA DATA HILANG saat proses dihentikan.
 * Hanya untuk pengembangan/pengujian lokal — jangan dipakai di produksi.
 *
 *   npm run dev:memory
 */
import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB } from '../src/config/db.js';
import { createApp } from '../src/app.js';
import User from '../src/models/User.js';
import { hashPassword } from '../src/controllers/authController.js';
import { seedDatabase } from './seed.js';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === 'ganti_dengan_string_acak_yang_panjang') {
  process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
  console.log('[demo] JWT_SECRET acak sementara dibuat untuk sesi demo ini.');
}

const mongod = await MongoMemoryServer.create();
await connectDB(mongod.getUri('agritech'));
await seedDatabase();

const demoAccounts = [
  { name: 'Admin Demo', email: 'admin@agritech.demo', phone: '081200000001', address: 'Kantor AgriTech (demo)', role: 'admin', isVerified: true, password: 'AdminDemo123' },
  { name: 'Budi Santoso', email: 'petani@agritech.demo', phone: '081200000002', address: 'Desa Sukamaju, Karawang (demo)', role: 'farmer', password: 'PetaniDemo123' },
];
for (const { password, ...acc } of demoAccounts) {
  await User.create({ ...acc, accountStatus: 'active', passwordHash: await hashPassword(password) });
}

createApp().listen(PORT, () => {
  console.log(`\n[demo] AgriTech API (database memori) berjalan di http://localhost:${PORT}/api`);
  console.log('[demo] Akun demo (HANYA untuk mode demo):');
  for (const a of demoAccounts) console.log(`        - ${a.role.padEnd(6)} ${a.email} / ${a.password}`);
  console.log('[demo] Data akan hilang saat server dihentikan.\n');
});

const shutdown = async () => {
  await mongod.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

