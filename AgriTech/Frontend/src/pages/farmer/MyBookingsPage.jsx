import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiCalendar, FiClock, FiPlus, FiMapPin } from 'react-icons/fi';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    bookingDate: '',
    preferredTime: '08:00',
    farmId: '',
    location: '',
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, sRes, fRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/services'),
        api.get('/farms'),
      ]);
      if (bRes.data?.success) setBookings(bRes.data.data);
      if (sRes.data?.success) setServices(sRes.data.data);
      if (fRes.data?.success) setFarms(fRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', formData);
      setShowModal(false);
      setFormData({
        serviceId: '',
        bookingDate: '',
        preferredTime: '08:00',
        farmId: '',
        location: '',
        notes: '',
      });
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Gagal mengajukan booking');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disetujui': return 'badge-success';
      case 'Selesai': return 'badge-info';
      case 'Ditolak': case 'Dibatalkan': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <h1>Booking Layanan Pertanian</h1>
          <p className="text-muted">Penyewaan alat traktor, pompa air, tenaga bantuan panen, dan konsultasi lapangan.</p>
        </div>
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => {
            if (services.length > 0) {
              setFormData(prev => ({ ...prev, serviceId: services[0]._id }));
            }
            setShowModal(true);
          }}
        >
          <FiPlus /> Ajukan Booking Baru
        </button>
      </div>

      {loading ? (
        <div className="loader-block">
          <div className="spinner" />
          <span>Memuat daftar booking...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon"><FiCalendar /></div>
          <h3>Belum Ada Booking Layanan</h3>
          <p>Anda belum pernah mengajukan sewa alat atau konsultasi pertanian.</p>
        </div>
      ) : (
        <div className="grid-2">
          {bookings.map((b) => (
            <div key={b._id} className="card stack">
              <div className="row-between">
                <div>
                  <h3 style={{ margin: 0 }}>{b.serviceName}</h3>
                  <span className="text-xs text-muted">{b.serviceCategory}</span>
                </div>
                <span className={`badge ${getStatusBadge(b.status)}`}>
                  {b.status}
                </span>
              </div>

              <div className="dl" style={{ fontSize: '0.86rem' }}>
                <dt>Tanggal:</dt>
                <dd>{new Date(b.bookingDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</dd>
                <dt>Waktu:</dt>
                <dd>{b.preferredTime} WIB</dd>
                <dt>Lokasi:</dt>
                <dd>{b.farmId?.farmName || b.location || 'Lahan Petani'}</dd>
              </div>

              {b.notes && <p className="text-xs text-muted" style={{ margin: 0 }}>Catatan: {b.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Modal Booking */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Ajukan Booking Layanan Tani</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body stack">
                <div className="field">
                  <label>Pilih Layanan <span className="req">*</span></label>
                  <select
                    className="select"
                    required
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  >
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Tanggal Pelaksanaan <span className="req">*</span></label>
                    <input
                      type="date"
                      className="input"
                      required
                      value={formData.bookingDate}
                      onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Waktu Jam <span className="req">*</span></label>
                    <input
                      type="time"
                      className="input"
                      required
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Pilih Kebun / Lokasi</label>
                  <select
                    className="select"
                    value={formData.farmId}
                    onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  >
                    <option value="">-- Masukkan lokasi manual --</option>
                    {farms.map((f) => (
                      <option key={f._id} value={f._id}>{f.farmName} ({f.location})</option>
                    ))}
                  </select>
                </div>

                {!formData.farmId && (
                  <div className="field">
                    <label>Lokasi Manual <span className="req">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Alamat kebun / lahan"
                      required={!formData.farmId}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                )}

                <div className="field">
                  <label>Catatan Tambahan (Opsional)</label>
                  <textarea
                    className="textarea"
                    placeholder="Contoh: Butuh operator traktor yang berpengalaman di sawah berlumpur dalam."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Ajukan Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
