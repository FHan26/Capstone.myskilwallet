import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiCheckCircle, 
  FiSun, 
  FiCloudRain, 
  FiShoppingBag, 
  FiUsers, 
  FiActivity, 
  FiLayers 
} from 'react-icons/fi';
import { GiWheat, GiCorn, GiChiliPepper, GiPlantWatering } from 'react-icons/gi';
import heroImg from '../../assets/hero-farmer.jpg';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">
                <GiPlantWatering size={18} /> Platform Digital Pertanian Indonesia
              </div>
              <h1>
                Bertani Lebih Cerdas dengan <em>Teknologi Digital</em>
              </h1>
              <p className="hero-lead">
                AgriTech mendampingi petani mengelola lahan, memantau fase pertumbuhan tanaman, mengakses prakiraan cuaca, hingga memesan kebutuhan pertanian dalam satu aplikasi terintegrasi.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Mulai Sekarang <FiArrowRight />
                </Link>
                <a href="#fitur" className="btn btn-secondary btn-lg">
                  Jelajahi Fitur
                </a>
              </div>
              <div className="hero-points">
                <span><FiCheckCircle /> Gratis untuk Petani Mandiri</span>
                <span><FiCheckCircle /> Rekomendasi Tanam & Pemupukan</span>
                <span><FiCheckCircle /> Terhubung dengan Pasar Tani</span>
              </div>
            </div>

            <div className="hero-media">
              <img 
                src={heroImg} 
                alt="Petani menggunakan smartphone di persawahan" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="hero-float f1">
                <div className="ic"><FiActivity /></div>
                <div>
                  <strong>Monitoring Fase Tumbuh</strong>
                  <span className="text-muted">Siap panen dalam 12 hari</span>
                </div>
              </div>
              <div className="hero-float f2">
                <div className="ic"><FiSun /></div>
                <div>
                  <strong>Prakiraan Cuaca Terkini</strong>
                  <span className="text-muted">28°C — Cerah Berawan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Fitur Utama */}
      <section id="fitur" className="section section-alt">
        <div className="container">
          <div className="section-head center">
            <div className="eyebrow">Fitur Unggulan</div>
            <h2>Semua Kebutuhan Pertanian Anda dalam Satu Genggaman</h2>
            <p>
              Dirancang khusus untuk memudahkan alur kerja petani mulai dari pembukaan lahan, perawatan rutin, hingga distribusi panen.
            </p>
          </div>

          <div className="grid-3">
            <div className="card card-hover feature-card">
              <div className="feature-icon"><FiLayers /></div>
              <h3>Manajemen Kebun & Lahan</h3>
              <p>Catat luas lahan, jenis tanah, sistem irigasi, dan kondisi pH tanah secara rapi dan terdokumentasi.</p>
            </div>

            <div className="card card-hover feature-card">
              <div className="feature-icon"><GiPlantWatering /></div>
              <h3>Pemantauan Tanaman</h3>
              <p>Lacak fase pertumbuhan komoditas, riwayat penyiraman, pemupukan, hingga estimasi hitung mundur tanggal panen.</p>
            </div>

            <div className="card card-hover feature-card">
              <div className="feature-icon"><FiCloudRain /></div>
              <h3>Informasi Cuaca Terintegrasi</h3>
              <p>Dapatkan prakiraan cuaca, kelembapan, dan kecepatan angin untuk mengantisipasi jadwal pengairan dan penyemprotan.</p>
            </div>

            <div className="card card-hover feature-card">
              <div className="feature-icon"><FiShoppingBag /></div>
              <h3>Pasar Sarana Pertanian</h3>
              <p>Beli benih bersertifikat, pupuk berkualitas, obat perlindungan tanaman, dan alat pertanian langsung dari katalog resmi.</p>
            </div>

            <div className="card card-hover feature-card">
              <div className="feature-icon"><FiActivity /></div>
              <h3>Booking Layanan Pertanian</h3>
              <p>Sewa traktor, pompa air, tenaga kerja bantuan panen, atau konsultasi langsung bersama pakar pertanian.</p>
            </div>

            <div className="card card-hover feature-card">
              <div className="feature-icon"><FiUsers /></div>
              <h3>Komunitas & Konsultasi</h3>
              <p>Berdiskusi antar-petani seputar kendala penyakit tanaman, tren harga komoditas, dan praktik tani terbaik.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Komoditas Unggulan */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Komoditas & Panduan</div>
            <h2>Panduan Budidaya Tanaman Populer</h2>
            <p>Dapatkan informasi kondisi tumbuh, rekomendasi pemupukan, dan pengendalian hama untuk komoditas utama.</p>
          </div>

          <div className="grid-3">
            <div className="card card-hover">
              <div className="row" style={{ marginBottom: 12 }}>
                <div className="feature-icon" style={{ background: '#e4eee1', color: '#2f5d3a' }}>
                  <GiWheat size={26} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>Padi Sawah</h3>
                  <span className="badge badge-success">Tanaman Pangan</span>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Panduan pengairan berselang, pemupukan berimbang NPK, dan antisipasi hama wereng batang cokelat serta blas.
              </p>
              <Link to="/informasi-tanaman" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
                Lihat Panduan <FiArrowRight />
              </Link>
            </div>

            <div className="card card-hover">
              <div className="row" style={{ marginBottom: 12 }}>
                <div className="feature-icon" style={{ background: '#fbf1dc', color: '#9a6512' }}>
                  <GiCorn size={26} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>Jagung Hibrida</h3>
                  <span className="badge badge-warning">Tanaman Pangan</span>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Kebutuhan air kritis fase pembungaan, jarak tanam efektif, dan penanganan ulat grayak (Spodoptera frugiperda).
              </p>
              <Link to="/informasi-tanaman" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
                Lihat Panduan <FiArrowRight />
              </Link>
            </div>

            <div className="card card-hover">
              <div className="row" style={{ marginBottom: 12 }}>
                <div className="feature-icon" style={{ background: '#fbeae6', color: '#b3412f' }}>
                  <GiChiliPepper size={26} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>Cabai Merah</h3>
                  <span className="badge badge-danger">Hortikultura</span>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Teknik bedengan bermulsa, pengaturan drainase musim hujan, dan pencegahan penyakit patek (antraknosa).
              </p>
              <Link to="/informasi-tanaman" className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
                Lihat Panduan <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Siap Meningkatkan Produktivitas Lahan Anda?</h2>
              <p>Daftarkan akun sekarang dan mulai catat kebun pertama Anda secara digital bersama ribuan petani lainnya.</p>
            </div>
            <div className="row">
              <Link to="/register" className="btn btn-light btn-lg">
                Daftar Gratis
              </Link>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ background: '#fff', color: '#1f3d2b' }}>
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
