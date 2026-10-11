import { useState, useEffect } from 'react';
import api from '../../api/client';
import { 
  FiUsers, 
  FiLayers, 
  FiShoppingBag, 
  FiCalendar, 
  FiActivity, 
  FiDollarSign 
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loader-block page-loader">
        <div className="spinner" />
        <span>Memuat statistik administrator...</span>
      </div>
    );
  }

  const totals = data?.totals || {};
  const recentActs = data?.recentActivities || [];

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="stack">
      <div>
        <h1>Dashboard Administrator</h1>
        <p className="text-muted">Ikhtisar metrik platform AgriTech, aktivitas pengguna, dan transaksi berjalan.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-4">
        <div className="card stat-card">
          <div className="stat-icon"><FiUsers /></div>
          <div>
            <div className="stat-label">Total Pengguna</div>
            <div className="stat-value">{totals.totalUsers || 0}</div>
            <div className="stat-sub">{totals.totalFarmers || 0} petani aktif</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon info"><FiLayers /></div>
          <div>
            <div className="stat-label">Lahan Terdaftar</div>
            <div className="stat-value">{totals.totalFarms || 0}</div>
            <div className="stat-sub">{totals.totalCrops || 0} siklus tanaman</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon warning"><FiShoppingBag /></div>
          <div>
            <div className="stat-label">Pesanan Tertunda</div>
            <div className="stat-value">{totals.pendingOrders || 0}</div>
            <div className="stat-sub">Dari {totals.totalOrders || 0} transaksi</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon beige"><FiDollarSign /></div>
          <div>
            <div className="stat-label">Omzet Pesanan</div>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>
              {formatRupiah(totals.revenue)}
            </div>
            <div className="stat-sub">{totals.pendingBookings || 0} booking tertunda</div>
          </div>
        </div>
      </div>

      {/* Aktivitas Sistem */}
      <div className="card">
        <div className="card-header">
          <h3><FiActivity /> Aktivitas Terbaru Platform</h3>
        </div>
        {recentActs.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px 0' }}>
            <p>Belum ada aktivitas transaksi atau pengguna baru.</p>
          </div>
        ) : (
          <div className="timeline">
            {recentActs.map((act, idx) => (
              <div key={idx} className="timeline-item">
                <div className="row-between">
                  <div>
                    <strong>{act.text}</strong>
                  </div>
                  <span className="text-xs text-soft">
                    {new Date(act.date).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
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
