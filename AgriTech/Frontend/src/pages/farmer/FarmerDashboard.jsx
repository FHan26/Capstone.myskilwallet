import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { 
  FiMapPin, 
  FiActivity, 
  FiSun, 
  FiShoppingBag, 
  FiCalendar, 
  FiPlus, 
  FiArrowRight, 
  FiCheckCircle 
} from 'react-icons/fi';
import { GiWheat, GiPlantWatering } from 'react-icons/gi';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/me/dashboard');
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Gagal mengambil data dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async () => {
      try {
        const res = await api.get('/weather/current', { params: { city: 'Karawang' } });
        if (res.data?.success) {
          setWeather(res.data.data);
        }
      } catch {
        // Cuaca opsional bila API key belum diset
      }
    };

    fetchDashboard();
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="loader-block page-loader">
        <div className="spinner" />
        <span>Memuat data dashboard kebun Anda...</span>
      </div>
    );
  }

  const stats = data?.stats || {};
  const harvests = data?.upcomingHarvests || [];
  const activities = data?.recentActivities || [];

  return (
    <div className="stack">
      {/* Welcome Banner */}
      <div className="row-between">
        <div>
          <h1>Halo, {user?.name || 'Petani'}! 🌱</h1>
          <p className="text-muted">
            Selamat datang di pusat kendali kebun Anda. Pantau perkembangan tanaman dan jadwal perawatan hari ini.
          </p>
        </div>
        <div className="row">
          <Link to="/petani/kebun" className="btn btn-primary btn-sm">
            <FiPlus /> Tambah Kebun
          </Link>
          <Link to="/petani/tanaman" className="btn btn-secondary btn-sm">
            <FiPlus /> Tambah Tanaman
          </Link>
        </div>
      </div>

      {/* Ringkasan Angka */}
      <div className="grid-4">
        <div className="card stat-card">
          <div className="stat-icon"><FiMapPin /></div>
          <div>
            <div className="stat-label">Total Kebun Terdaftar</div>
            <div className="stat-value">{stats.farmCount || 0}</div>
            <div className="stat-sub">Lokasi aktif</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon"><GiWheat /></div>
          <div>
            <div className="stat-label">Tanaman Aktif</div>
            <div className="stat-value">{stats.activeCropCount || 0}</div>
            <div className="stat-sub">Dari {stats.totalCropCount || 0} total dicatat</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon warning"><FiShoppingBag /></div>
          <div>
            <div className="stat-label">Pesanan Berjalan</div>
            <div className="stat-value">{stats.pendingOrders || 0}</div>
            <div className="stat-sub">Menunggu konfirmasi</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon info"><FiCalendar /></div>
          <div>
            <div className="stat-label">Booking Layanan</div>
            <div className="stat-value">{stats.pendingBookings || 0}</div>
            <div className="stat-sub">Menunggu jadwal</div>
          </div>
        </div>
      </div>

      {/* Grid Cuaca & Panen Mendatang */}
      <div className="grid-2">
        {/* Ringkasan Cuaca */}
        <div className="card">
          <div className="card-header">
            <h3><FiSun /> Prakiraan Cuaca Hari Ini</h3>
            <span className="badge badge-outline">Lokasi: Karawang</span>
          </div>

          {weather ? (
            <div className="row-between" style={{ alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#1f3d2b', lineHeight: 1 }}>
                  {Math.round(weather.temperature)}°C
                </div>
                <div className="text-muted" style={{ textTransform: 'capitalize', marginTop: 4 }}>
                  {weather.description}
                </div>
                <div className="text-xs text-soft" style={{ marginTop: 8 }}>
                  Kelembapan: {weather.humidity}% | Angin: {weather.windSpeed} m/s
                </div>
              </div>
              {weather.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="Ikon cuaca"
                  style={{ width: 80, height: 80 }}
                />
              )}
            </div>
          ) : (
            <p className="text-muted text-sm">
              Informasi cuaca saat ini menggunakan default area lahan. Konfigurasikan API key OpenWeatherMap di backend untuk integrasi real-time.
            </p>
          )}
        </div>

        {/* Panen Mendatang */}
        <div className="card">
          <div className="card-header">
            <h3><GiPlantWatering /> Jadwal Panen Mendatang</h3>
            <Link to="/petani/tanaman" className="text-sm">Lihat Semua</Link>
          </div>

          {harvests.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px 0' }}>
              <p>Belum ada jadwal panen terdekat dalam sistem.</p>
            </div>
          ) : (
            <div className="list">
              {harvests.map((h) => (
                <div key={h._id} className="list-item">
                  <div className="list-icon"><GiWheat /></div>
                  <div className="flex-1">
                    <div className="list-title">{h.cropName} ({h.cropType})</div>
                    <div className="list-sub">Lokasi: {h.farmName || 'Kebun'}</div>
                  </div>
                  <div className="text-right">
                    <span className="badge badge-warning">
                      {new Date(h.estimatedHarvestDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Aktivitas Terbaru */}
      <div className="card">
        <div className="card-header">
          <h3><FiActivity /> Aktivitas Pertanian Terkini</h3>
          <Link to="/petani/tanaman" className="text-sm">Riwayat Lengkap</Link>
        </div>

        {activities.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px 0' }}>
            <p>Belum ada catatan aktivitas pemupukan atau penyiraman yang disimpan.</p>
          </div>
        ) : (
          <div className="timeline">
            {activities.map((a, idx) => (
              <div key={idx} className="timeline-item">
                <div className="row-between">
                  <div>
                    <strong>{a.activityType}</strong> — {a.cropName} ({a.farmName || 'Kebun'})
                    <div className="text-muted text-sm">{a.description}</div>
                  </div>
                  <span className="text-xs text-soft">
                    {new Date(a.activityDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
