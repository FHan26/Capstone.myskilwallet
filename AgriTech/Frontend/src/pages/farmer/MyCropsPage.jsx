import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiPlus, FiTrash2, FiSearch, FiCalendar, FiClock } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

export default function MyCropsPage() {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    farmId: '',
    cropName: '',
    cropType: '',
    plantingDate: '',
    estimatedHarvestDate: '',
    growthStage: 'Benih',
    status: 'Penanaman',
    notes: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cropsRes, farmsRes] = await Promise.all([
        api.get('/crops'),
        api.get('/farms'),
      ]);
      if (cropsRes.data?.success) setCrops(cropsRes.data.data);
      if (farmsRes.data?.success) setFarms(farmsRes.data.data);
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
      await api.post('/crops', formData);
      setShowModal(false);
      setFormData({
        farmId: '',
        cropName: '',
        cropType: '',
        plantingDate: '',
        estimatedHarvestDate: '',
        growthStage: 'Benih',
        status: 'Penanaman',
        notes: '',
      });
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Gagal menambahkan tanaman');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus pencatatan tanaman "${name}"?`)) {
      try {
        await api.delete(`/crops/${id}`);
        fetchData();
      } catch (err) {
        alert(err?.response?.data?.message || 'Gagal menghapus');
      }
    }
  };

  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <h1>Tanaman Saya</h1>
          <p className="text-muted">Pantau siklus tanam, tahapan pertumbuhan, dan jadwal panen komoditas Anda.</p>
        </div>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={() => {
            if (farms.length === 0) {
              alert('Anda belum memiliki kebun terdaftar. Silakan tambahkan kebun terlebih dahulu di menu "Kebun Saya".');
              return;
            }
            setFormData(prev => ({ ...prev, farmId: farms[0]._id }));
            setShowModal(true);
          }}
        >
          Tambah Tanaman Baru
        </button>
      </div>

      {loading ? (
        <div className="loader-block">
          <div className="spinner" />
          <span>Memuat data tanaman...</span>
        </div>
      ) : crops.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon"><GiWheat /></div>
          <h3>Belum Ada Tanaman Aktif</h3>
          <p>Mulai catat tanggal tanam dan komoditas di kebun Anda untuk mendapatkan estimasi panen otomatis.</p>
        </div>
      ) : (
        <div className="grid-2">
          {crops.map((c) => (
            <div key={c._id} className="card card-hover entity-card">
              <div className="row-between">
                <div>
                  <h3 style={{ margin: 0 }}>{c.cropName}</h3>
                  <span className="text-xs text-muted">Varietas: {c.cropType}</span>
                </div>
                <span className="badge badge-success">{c.status}</span>
              </div>

              <div className="dl" style={{ fontSize: '0.86rem' }}>
                <dt>Kebun Lahan:</dt>
                <dd>{c.farmId?.farmName || 'Kebun'}</dd>
                <dt>Fase Tumbuh:</dt>
                <dd><strong>{c.growthStage}</strong></dd>
                <dt>Tanggal Tanam:</dt>
                <dd>{new Date(c.plantingDate).toLocaleDateString('id-ID')}</dd>
                {c.estimatedHarvestDate && (
                  <>
                    <dt>Estimasi Panen:</dt>
                    <dd>{new Date(c.estimatedHarvestDate).toLocaleDateString('id-ID')}</dd>
                  </>
                )}
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-danger-soft btn-sm"
                  onClick={() => handleDelete(c._id, c.cropName)}
                  style={{ marginLeft: 'auto' }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Tanaman */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>Tambah Komoditas Tanaman Baru</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body stack">
                <div className="field">
                  <label>Pilih Kebun <span className="req">*</span></label>
                  <select
                    className="select"
                    required
                    value={formData.farmId}
                    onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
                  >
                    {farms.map((f) => (
                      <option key={f._id} value={f._id}>{f.farmName} ({f.location})</option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Nama Tanaman <span className="req">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Contoh: Padi Ciherang"
                      required
                      value={formData.cropName}
                      onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Jenis / Varietas <span className="req">*</span></label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Contoh: Inpari 32 / Hibrida"
                      required
                      value={formData.cropType}
                      onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Tanggal Tanam <span className="req">*</span></label>
                    <input
                      type="date"
                      className="input"
                      required
                      value={formData.plantingDate}
                      onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Estimasi Panen</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.estimatedHarvestDate}
                      onChange={(e) => setFormData({ ...formData, estimatedHarvestDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label>Fase Pertumbuhan</label>
                    <select
                      className="select"
                      value={formData.growthStage}
                      onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                    >
                      <option value="Benih">Benih</option>
                      <option value="Persemaian">Persemaian</option>
                      <option value="Vegetatif Awal">Vegetatif Awal</option>
                      <option value="Vegetatif">Vegetatif</option>
                      <option value="Generatif">Generatif</option>
                      <option value="Pembungaan">Pembungaan</option>
                      <option value="Pembuahan">Pembuahan</option>
                      <option value="Pematangan">Pematangan</option>
                      <option value="Panen">Panen</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Status Tanaman</label>
                    <select
                      className="select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Persiapan Lahan">Persiapan Lahan</option>
                      <option value="Penanaman">Penanaman</option>
                      <option value="Pertumbuhan">Pertumbuhan</option>
                      <option value="Perawatan">Perawatan</option>
                      <option value="Siap Panen">Siap Panen</option>
                      <option value="Selesai Panen">Selesai Panen</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Tanaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
