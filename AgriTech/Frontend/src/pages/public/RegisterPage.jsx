import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { GiPlantRoots } from 'react-icons/gi';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await register(formData);
      if (res?.data?.requiresApproval) {
        setSuccessMsg('Registrasi berhasil! Akun Anda sedang menunggu persetujuan administrator.');
      } else {
        navigate('/petani/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Pendaftaran gagal. Periksa data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <div>
          <Link to="/" className="brand brand-light">
            <div className="brand-mark">
              <GiPlantRoots />
            </div>
            <span>Agri<em>Tech</em></span>
          </Link>
          <div style={{ marginTop: 40 }}>
            <h2>Bergabung Bersama Petani Mandiri Indonesia</h2>
            <p>
              Daftarkan diri Anda untuk mendapatkan akses gratis ke seluruh fitur manajemen pertanian, pencatatan siklus tanam, dan katalog sarana produksi tani.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.88rem', color: '#b9c8b8' }}>
          &copy; {new Date().getFullYear()} AgriTech. Platform Terbuka untuk Seluruh Petani Indonesia.
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card wide">
          <h1>Pendaftaran Petani</h1>
          <p className="text-muted" style={{ marginBottom: 20 }}>
            Lengkapi data di bawah ini untuk membuat akun baru.
          </p>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              <FiAlertCircle />
              <div>{error}</div>
            </div>
          )}

          {successMsg ? (
            <div className="alert alert-success" style={{ marginBottom: 20 }}>
              <FiCheckCircle />
              <div>{successMsg}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="stack">
              <div className="form-grid">
                <div className="field full">
                  <label>Nama Lengkap <span className="req">*</span></label>
                  <div className="input-icon">
                    <FiUser />
                    <input
                      type="text"
                      name="name"
                      className="input"
                      placeholder="Contoh: Budi Santoso"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Email <span className="req">*</span></label>
                  <div className="input-icon">
                    <FiMail />
                    <input
                      type="email"
                      name="email"
                      className="input"
                      placeholder="budi@email.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Nomor Telepon/WA <span className="req">*</span></label>
                  <div className="input-icon">
                    <FiPhone />
                    <input
                      type="tel"
                      name="phone"
                      className="input"
                      placeholder="081234567890"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field full">
                  <label>Alamat Lengkap <span className="req">*</span></label>
                  <div className="input-icon">
                    <FiMapPin />
                    <input
                      type="text"
                      name="address"
                      className="input"
                      placeholder="Desa, Kecamatan, Kabupaten/Kota"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Password <span className="req">*</span></label>
                  <div className="input-icon">
                    <FiLock />
                    <input
                      type="password"
                      name="password"
                      className="input"
                      placeholder="Min. 8 karakter (huruf & angka)"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Konfirmasi Password <span className="req">*</span></label>
                  <div className="input-icon">
                    <FiLock />
                    <input
                      type="password"
                      name="confirmPassword"
                      className="input"
                      placeholder="Ulangi password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 12 }}>
                {loading ? <div className="spinner" /> : 'Buat Akun Sekarang'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted" style={{ marginTop: 24 }}>
            Sudah memiliki akun? <Link to="/login" className="fw-600">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
