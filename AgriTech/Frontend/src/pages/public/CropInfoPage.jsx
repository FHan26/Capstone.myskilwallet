import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiSearch, FiBookOpen } from 'react-icons/fi';

export default function CropInfoPage() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await api.get('/crop-information', {
        params: { q: search, category },
      });
      if (res.data?.success) {
        setCrops(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCrops();
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Ensiklopedia Tani</div>
          <h1>Katalog Informasi Tanaman & Komoditas</h1>
          <p>
            Informasi lengkap siklus tumbuh, panduan pemupukan, kebutuhan jenis tanah, dan cara penanganan hama serta penyakit tanaman.
          </p>
        </div>

        {/* Toolbar Filter */}
        <div className="toolbar">
          <form onSubmit={handleSearchSubmit} className="input-icon">
            <FiSearch />
            <input
              type="text"
              className="input"
              placeholder="Cari tanaman atau penyakit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Semua Kategori</option>
            <option value="Tanaman Pangan">Tanaman Pangan</option>
            <option value="Hortikultura">Hortikultura</option>
            <option value="Sayuran">Sayuran</option>
            <option value="Buah">Buah</option>
            <option value="Perkebunan">Perkebunan</option>
            <option value="Rempah dan Obat">Rempah dan Obat</option>
          </select>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="loader-block">
            <div className="spinner" />
            <span>Memuat informasi tanaman...</span>
          </div>
        ) : crops.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon"><FiBookOpen /></div>
            <h3>Tanaman Tidak Ditemukan</h3>
            <p>Coba gunakan kata kunci pencarian atau kategori lain.</p>
          </div>
        ) : (
          <div className="grid-2">
            {crops.map((c) => (
              <div key={c._id} className="card card-hover stack">
                <div className="row-between">
                  <div>
                    <h3 style={{ margin: 0 }}>{c.cropName}</h3>
                    {c.scientificName && (
                      <span className="text-muted text-sm" style={{ fontStyle: 'italic' }}>
                        {c.scientificName}
                      </span>
                    )}
                  </div>
                  <span className="badge badge-success">{c.category}</span>
                </div>

                <p className="text-muted" style={{ fontSize: '0.92rem' }}>{c.description}</p>

                <div className="card-muted" style={{ padding: 12, borderRadius: 8, fontSize: '0.86rem' }}>
                  <div style={{ marginBottom: 4 }}>
                    <strong>Syarat Tumbuh:</strong> {c.growingConditions || '-'}
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <strong>Kebutuhan Tanah:</strong> {c.soilRequirements || '-'}
                  </div>
                  <div>
                    <strong>Masa Tumbuh:</strong> {c.estimatedGrowingPeriod || '-'}
                  </div>
                </div>

                {c.commonPests && c.commonPests.length > 0 && (
                  <div>
                    <strong style={{ fontSize: '0.86rem' }}>Hama & Penyakit Utama:</strong>
                    <div className="row" style={{ marginTop: 6, gap: 6 }}>
                      {c.commonPests.map((p, idx) => (
                        <span key={idx} className="badge badge-danger">
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
