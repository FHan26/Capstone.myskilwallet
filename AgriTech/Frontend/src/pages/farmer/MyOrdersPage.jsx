import { useState, useEffect } from 'react';
import api from '../../api/client';
import { FiShoppingBag, FiClock } from 'react-icons/fi';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai': return 'badge-success';
      case 'Diproses': case 'Dikirim': return 'badge-info';
      case 'Dibatalkan': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <div className="stack">
      <div className="row-between">
        <div>
          <h1>Pesanan Saya</h1>
          <p className="text-muted">Riwayat transaksi sarana pertanian, benih, pupuk, dan peralatan.</p>
        </div>
      </div>

      {loading ? (
        <div className="loader-block">
          <div className="spinner" />
          <span>Memuat daftar pesanan...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon"><FiShoppingBag /></div>
          <h3>Belum Ada Pesanan</h3>
          <p>Anda belum pernah melakukan pemesanan produk di pasar tani.</p>
        </div>
      ) : (
        <div className="stack">
          {orders.map((o) => (
            <div key={o._id} className="card stack">
              <div className="row-between">
                <div>
                  <strong>{o.orderNumber}</strong>
                  <span className="text-muted text-xs" style={{ marginLeft: 8 }}>
                    {new Date(o.orderDate || o.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </span>
                </div>
                <span className={`badge ${getStatusBadge(o.status)}`}>
                  {o.status}
                </span>
              </div>

              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Jumlah</th>
                      <th>Harga Satuan</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>{it.productName}</td>
                        <td>{it.quantity} {it.unit}</td>
                        <td>{formatRupiah(it.price)}</td>
                        <td>{formatRupiah(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <div className="text-xs text-muted">
                  Alamat Pengiriman: {o.deliveryAddress}
                </div>
                <div>
                  Total Tagihan: <strong className="price">{formatRupiah(o.totalAmount)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
