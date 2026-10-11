/**
 * Membuat (atau mempromosikan) akun administrator secara aman dari terminal server.
 * Tidak ada endpoint publik untuk membuat admin.
 *
 * Penggunaan:
 *   npm run create-admin
 *     -> menanyakan nama, email, telepon, alamat, dan password secara interaktif
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD di .env juga dapat dipakai (hapus setelah digunakan).
 */
import 'dotenv/config';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import { hashPassword, validatePasswordStrength } from '../src/controllers/authController.js';

async function ask(rl, question, fallback) {
  if (fallback) return fallback;
  const answer = await rl.question(question);
  return answer.trim();
}

async function main() {
  const rl = readline.createInterface({ input, output });
  try {
    const name = await ask(rl, 'Nama admin: ', process.env.ADMIN_NAME);
    const email = (await ask(rl, 'Email admin: ', process.env.ADMIN_EMAIL)).toLowerCase();
    const password = await ask(rl, 'Password admin (min. 8 karakter, huruf & angka): ', process.env.ADMIN_PASSWORD);
    const pwError = validatePasswordStrength(password);
    if (pwError) throw new Error(pwError);

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      const confirm = await rl.question(`Pengguna ${email} sudah ada (peran: ${existing.role}). Jadikan admin dan atur ulang password? (y/N): `);
      if (confirm.trim().toLowerCase() !== 'y') {
        console.log('Dibatalkan.');
        return;
      }
      existing.role = 'admin';
      existing.accountStatus = 'active';
      existing.isVerified = true;
      existing.passwordHash = await hashPassword(password);
      await existing.save();
      console.log(`[admin] ${email} sekarang berperan sebagai administrator.`);
      return;
    }
    const phone = await ask(rl, 'Nomor telepon (contoh 081234567890): ', process.env.ADMIN_PHONE || '');
    const address = await ask(rl, 'Alamat kantor: ', process.env.ADMIN_ADDRESS || '');
    await User.create({ name, email, phone, address, role: 'admin', accountStatus: 'active', isVerified: true, passwordHash: await hashPassword(password) });
    console.log(`[admin] Akun administrator ${email} berhasil dibuat.`);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('[admin] Gagal:', err.message);
  process.exitCode = 1;
});

