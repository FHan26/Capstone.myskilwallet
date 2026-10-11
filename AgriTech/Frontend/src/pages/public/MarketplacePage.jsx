import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiSearch, FiShoppingBag, FiTag } from 'react-icons/fi';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: { q: search, category },
      });
      if (res.data?.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Pasar Sarana Pertanian</div>
          <h1>Produk & Sarana Produksi Tani</h1>
          <p>
            Dapatkan benih unggul, pupuk berkualitas, obat perlindungan tanaman, dan peralatan pertanian terpercaya.
          </p>
        </div>

        {/* Toolbar Filter */}
        <div className="toolbar">
          <form onSubmit={handleSearchSubmit} className="input-icon">
            <FiSearch />
            <input
              type="text"
              className="input"
              placeholder="Cari pupuk, benih, alat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Semua Kategori</option>
            <option value="Benih dan Bibit">Benih dan Bibit</option>
            <option value="Pupuk">Pupuk</option>
            <option value="Pestisida dan Proteksi Tanaman">Pestisida & Proteksi</option>
            <option value="Peralatan Pertanian">Peralatan Pertanian</option>
            <option value="Perlengkapan Irigasi">Perlengkapan Irigasi</option>
          </select>
        </div>

        {loading ? (
          <div className="loader-block">
            <div className="spinner" />
            <span>Memuat produk pertanian...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon"><FiShoppingBag /></div>
            <h3>Produk Belum Tersedia</h3>
            <p>Tidak ada produk yang cocok dengan kriteria pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid-3">
            {products.map((p) => (
              <div key={p._id} className="card card-hover product-card">
                <div className="product-media">
                  <FiTag size={42} opacity={0.35} />
                </div>
                <div className="product-body">
                  <span className="badge badge-outline" style={{ alignSelf: 'flex-start' }}>{p.category}</span>
                  <h3>{p.productName}</h3>
                  <p className="text-muted text-sm" style={{ margin: 0, flex: 1 }}>{p.description}</p>
                  <div className="row-between" style={{ marginTop: 12 }}>
                    <div>
                      <div className="price">{formatRupiah(p.price)}</div>
                      <span className="text-xs text-muted">Stok: {p.stock} {p.unit}</span>
                    </div>
                    <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {p.stock > 0 ? 'Tersedia' : 'Habis'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
