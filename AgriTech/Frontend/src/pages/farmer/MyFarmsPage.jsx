import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiPlus, FiMapPin, FiTrash2, FiEdit2, FiSearch, FiLayers } from 'react-icons/fi';

export default function MyFarmsPage() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    city: '',
    farmSize: '',
    areaUnit: 'hektare',
    irrigationMethod: 'Irigasi Teknis',
    soilType: '',
    notes: '',
  });

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/farms', { params: { q: search } });
      if (res.data?.success) {
        setFarms(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/farms', formData);
      setShowModal(false);
      setFormData({
        farmName: '',
        location: '',
        city: '',
        farmSize: '',
        areaUnit: 'hektare',
        irrigationMethod: 'Irigasi Teknis',
        soilType: '',
        notes: '',
      });
      fetchFarms();
    } catch (err) {
      alert(err?.response?.data?.message || 'Gagal menyimpan kebun');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus kebun "${name}"? Seluruh data tanaman di kebun ini juga akan dihapus.`)) {
      try {
        await api.delete(`/farms/${id}`);
        fetchFarms();
      } catch (err) {
        alert(err?.response?.data?.message || 'Gagal menghapus');
      }
    }
  };

  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <h1>Kebun Saya</h1>
          <p className="text-muted">Kelola data seluruh petak kebun dan lahan pertanian Anda.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          <FiPlus /> Tambah Kebun Baru
        </button>
      </div>

      <div className="toolbar">
        <div className="input-icon">
          <FiSearch />
          <input
            type="text"
            className="input"
            placeholder="Cari berdasarkan nama kebun atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchFarms()}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-block">
          <div className="spinner" />
          <span>Memuat data kebun...</span>
        </div>
      ) : farms.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon"><FiLayers /></div>
          <h3>Belum Ada Kebun Terdaftar</h3>
          <p>Anda belum menambahkan data kebun. Klik tombol di bawah untuk mendaftarkan petak lahan pertama Anda.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Tambah Kebun Sekarang
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {farms.map((f) => (
            <div key={f._id} className="card card-hover entity-card">
              <div className="row-between">
                <div>
                  <h3 style={{ margin: 0 }}>{f.farmName}</h3>
                  <span className="text-xs text-muted"><FiMapPin /> {f.location} ({f.city || 'Daerah Lahan'})</span>
                </div>
                <span className="badge badge-green">
                  {f.farmSize} {f.areaUnit}
                </span>
              </div>

              <div className="dl" style={{ fontSize: '0.86rem' }}>
                <dt>Metode Irigasi:</dt>
                <dd>{f.irrigationMethod}</dd>
                <dt>Jenis Tanah:</dt>
                <dd>{f.soilType || 'Belum diisi'}</dd>
                <dt>Tanaman Aktif:</dt>
                <dd><strong>{f.activeCropCount || 0}</strong> komoditas</dd>
              </div>

              {f.notes && <p className="text-muted text-xs" style={{ margin: 0 }}>Catatan: {f.notes}</p>}

              <div className="card-actions">
                <button
                  className="btn btn-danger-soft btn-sm"
                  onClick={() => handleDelete(f._id, f.farmName)}
                  style={{ marginLeft: 'auto' }}
                >
                  <FiTrash2 /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Kebun */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Tambah Petak Kebun Baru</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body stack">
                <div className="field">
                  <label>Nama Kebun <span className="req">*</span></label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: Kebun Padi Blok Timur"
                    required
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Luas Lahan <span className="req">*</span></label>
                    <input
                      type="number"
                      step="any"
                      className="input"
                      placeholder="Contoh: 1.5"
                      required
                      value={formData.farmSize}
                      onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Satuan Luas</label>
                    <select
                      className="select"
                      value={formData.areaUnit}
                      onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                    >
                      <option value="hektare">Hektare</option>
                      <option value="are">Are</option>
                      <option value="meter persegi">Meter Persegi</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Kota / Kabupaten</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Contoh: Karawang"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Metode Irigasi <span className="req">*</span></label>
                    <select
                      className="select"
                      value={formData.irrigationMethod}
                      onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                    >
                      <option value="Irigasi Teknis">Irigasi Teknis</option>
                      <option value="Tadah Hujan">Tadah Hujan</option>
                      <option value="Irigasi Tetes">Irigasi Tetes</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Pompa Air">Pompa Air</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Alamat / Lokasi Lengkap <span className="req">*</span></label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Desa, dusun, atau patokan lokasi"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="field">
                  <label>Jenis Tanah (Opsional)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contoh: Aluvial / Lempung berpasir"
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Kebun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
