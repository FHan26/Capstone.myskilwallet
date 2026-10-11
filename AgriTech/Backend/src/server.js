import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;

export function checkEnv() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret === 'ganti_dengan_string_acak_yang_panjang') {
    console.error('[config] JWT_SECRET belum diatur atau terlalu pendek (min. 32 karakter). Lihat .env.example.');
    process.exit(1);
  }
}

async function start() {
  checkEnv();
  await connectDB();
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[server] AgriTech API berjalan di http://localhost:${PORT}/api`);
  });
}

start().catch((err) => {
  console.error('[server] Gagal memulai server:', err.message);
  process.exit(1);
});

