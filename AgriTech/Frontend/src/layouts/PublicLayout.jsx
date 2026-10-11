import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { GiPlantRoots } from 'react-icons/gi';

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <Link to="/" className="brand">
              <div className="brand-mark">
                <GiPlantRoots />
              </div>
              <span>Agri<em>Tech</em></span>
            </Link>

            <button
              className="btn btn-ghost btn-icon nav-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
              <div className="nav-links">
                <NavLink to="/" onClick={() => setMenuOpen(false)}>Beranda</NavLink>
                <a href="#fitur" onClick={() => setMenuOpen(false)}>Fitur</a>
                <NavLink to="/informasi-tanaman" onClick={() => setMenuOpen(false)}>Informasi Tanaman</NavLink>
                <NavLink to="/produk" onClick={() => setMenuOpen(false)}>Produk</NavLink>
                <NavLink to="/tentang-kami" onClick={() => setMenuOpen(false)}>Tentang Kami</NavLink>
              </div>

              <div className="nav-actions">
                {user ? (
                  <div className="row">
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/petani/dashboard'}
                      className="btn btn-soft btn-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FiUser /> Dashboard ({user.role === 'admin' ? 'Admin' : 'Petani'})
                    </Link>
                    <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Keluar">
                      <FiLogOut />
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>
                      Masuk
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                      Daftar Akun
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link to="/" className="brand brand-light" style={{ marginBottom: 14 }}>
                <div className="brand-mark">
                  <GiPlantRoots />
                </div>
                <span>Agri<em>Tech</em></span>
              </Link>
              <p style={{ maxWidth: 300, fontSize: '0.88rem' }}>
                Memberdayakan petani Indonesia melalui teknologi digital terpadu untuk efisiensi kebun, pemantauan cuaca, dan produktivitas hasil panen.
              </p>
            </div>

            <div>
              <h4>Navigasi</h4>
              <ul>
                <li><Link to="/">Beranda</Link></li>
                <li><Link to="/informasi-tanaman">Informasi Tanaman</Link></li>
                <li><Link to="/produk">Katalog Produk</Link></li>
                <li><Link to="/tentang-kami">Tentang Kami</Link></li>
              </ul>
            </div>

            <div>
              <h4>Layanan</h4>
              <ul>
                <li><Link to="/login">Pencatatan Kebun</Link></li>
                <li><Link to="/login">Kalender Tanam & Panen</Link></li>
                <li><Link to="/login">Prakiraan Cuaca Tani</Link></li>
                <li><Link to="/login">Konsultasi & Komunitas</Link></li>
              </ul>
            </div>

            <div>
              <h4>Kontak & Bantuan</h4>
              <ul>
                <li><FiMapPin /> Jl. Agrikultur No. 45, Karawang, Jawa Barat</li>
                <li><FiPhone /> +62 812-3456-7890</li>
                <li><FiMail /> dukungan@agritech.id</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>&copy; {new Date().getFullYear()} AgriTech. Seluruh hak cipta dilindungi.</div>
            <div className="row" style={{ gap: 16 }}>
              <a href="#privasi">Kebijakan Privasi</a>
              <a href="#syarat">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
