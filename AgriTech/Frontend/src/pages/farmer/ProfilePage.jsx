import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { FiUser, FiCheckCircle } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await api.put('/users/me', formData);
      if (res.data?.success) {
        setUser(res.data.data);
        setMsg('Profil berhasil diperbarui!');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stack" style={{ maxWidth: 640 }}>
      <h1>Profil Akun</h1>
      <p className="text-muted">Kelola data identitas dan informasi kontak petani Anda.</p>

      {msg && (
        <div className="alert alert-success">
          <FiCheckCircle />
          <div>{msg}</div>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit} className="stack">
          <div className="field">
            <label>Email Terdaftar (Tidak dapat diubah)</label>
            <input type="email" className="input" disabled value={user?.email || ''} />
          </div>

          <div className="field">
            <label>Peran Akun</label>
            <input type="text" className="input" disabled value={user?.role === 'admin' ? 'Administrator' : 'Petani'} />
          </div>

          <div className="field">
            <label>Nama Lengkap <span className="req">*</span></label>
            <input
              type="text"
              className="input"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Nomor Telepon / WhatsApp <span className="req">*</span></label>
            <input
              type="tel"
              className="input"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Alamat Lahan / Domisili <span className="req">*</span></label>
            <textarea
              className="textarea"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? <div className="spinner" /> : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
