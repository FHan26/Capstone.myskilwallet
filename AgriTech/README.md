# AgriTech — Empowering Farmers Through Digital Technology

AgriTech adalah platform pertanian digital yang membantu petani mengelola lahan pertanian, mencatat siklus tanaman & estimasi panen, memantau cuaca, serta memesan sarana produksi tani dan layanan pertanian.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router DOM, Axios, React Icons, Recharts, Custom CSS Design System
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Helmet, CORS, express-rate-limit
- **Weather API:** OpenWeatherMap API

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Kloning Repository
```bash
git clone <URL_REPO_ANDA>
cd AgriTech
```

### 2. Instal Dependensi
Anda dapat menginstal semua dependensi (root, Backend, dan Frontend) sekaligus dari folder root:
```bash
npm run install:all
```

### 3. Konfigurasi Environment (`.env`)

#### Backend:
Salin file `.env.example` di folder `Backend` menjadi `.env`:
```bash
cp Backend/.env.example Backend/.env
```
Lalu lengkapi nilainya:
- `MONGODB_URI`: URL koneksi MongoDB (lokal atau MongoDB Atlas).
- `JWT_SECRET`: String acak aman (minimal 32 karakter).
- `PORT`: `5001`
- `OPENWEATHER_API_KEY`: API key OpenWeatherMap.

#### Frontend:
Salin file `.env.example` di folder `Frontend` menjadi `.env`:
```bash
cp Frontend/.env.example Frontend/.env
```
Isi:
```env
VITE_API_BASE_URL=/api
VITE_DEV_PROXY_TARGET=http://localhost:5001
```

---

## ▶️ Menjalankan Aplikasi

Jalankan perintah ini di root folder `AgriTech` untuk menjalankan **Frontend** dan **Backend** secara paralel:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001/api

---

## 👤 Akun Demo Bawaan

| Peran | Email | Password |
|---|---|---|
| **Administrator** | `admin@agritech.demo` | `AdminDemo123` |
| **Petani** | `petani@agritech.demo` | `PetaniDemo123` |

