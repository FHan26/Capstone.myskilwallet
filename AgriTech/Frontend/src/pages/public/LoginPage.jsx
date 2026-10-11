import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { GiPlantRoots } from 'react-icons/gi';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      const role = res?.data?.user?.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/petani/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login gagal. Periksa email dan password.');
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
            <h2>Solusi Digital Menuju Kemandirian Petani</h2>
            <p>
              Masuk ke akun Anda untuk memonitor perkembangan tanaman, melihat jadwal irigasi, dan mengelola hasil panen secara terukur.
            </p>
          </div>
        </div>

        <div className="card-muted" style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.08)', color: '#c9d7c7' }}>
          <div style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>Akun Demo Pengujian:</div>
          <div style={{ fontSize: '0.85rem' }}>Petani: <code>petani@agritech.demo</code> / <code>PetaniDemo123</code></div>
          <div style={{ fontSize: '0.85rem' }}>Admin: <code>admin@agritech.demo</code> / <code>AdminDemo123</code></div>
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Masuk ke AgriTech</h1>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            Masukkan kredensial akun Anda untuk melanjutkan.
          </p>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: 20 }}>
              <FiAlertCircle />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="stack">
            <div className="field">
              <label>Email <span className="req">*</span></label>
              <div className="input-icon">
                <FiMail />
                <input
                  type="email"
                  className="input"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Password <span className="req">*</span></label>
              <div className="input-group">
                <div className="input-icon w-100">
                  <FiLock />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon input-addon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <div className="spinner" /> : 'Masuk'}
            </button>
          </form>

          <p className="text-center text-sm text-muted" style={{ marginTop: 24 }}>
            Belum memiliki akun? <Link to="/register" className="fw-600">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
