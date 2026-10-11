import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiMapPin, 
  FiSun, 
  FiShoppingBag, 
  FiCalendar, 
  FiUsers, 
  FiUser, 
  FiLogOut, 
  FiBookOpen, 
  FiActivity 
} from 'react-icons/fi';
import { GiPlantRoots, GiWheat } from 'react-icons/gi';

export default function FarmerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      {/* Sidebar Backdrop Mobile */}
      <div 
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="brand brand-light">
            <div className="brand-mark">
              <GiPlantRoots />
            </div>
            <span>Agri<em>Tech</em></span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-label">Utama</div>
          <NavLink to="/petani/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiHome /> Dashboard
          </NavLink>
          <NavLink to="/petani/kebun" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiMapPin /> Kebun Saya
          </NavLink>
          <NavLink to="/petani/tanaman" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <GiWheat /> Tanaman Saya
          </NavLink>

          <div className="sidebar-label">Informasi & Cuaca</div>
          <NavLink to="/informasi-tanaman" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiBookOpen /> Informasi Tanaman
          </NavLink>
          <NavLink to="/petani/cuaca" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiSun /> Cuaca
          </NavLink>

          <div className="sidebar-label">Pasar & Layanan</div>
          <NavLink to="/produk" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiShoppingBag /> Produk Pertanian
          </NavLink>
          <NavLink to="/petani/pesanan" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiActivity /> Pesanan Saya
          </NavLink>
          <NavLink to="/petani/booking" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiCalendar /> Booking Layanan
          </NavLink>
          <NavLink to="/petani/komunitas" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiUsers /> Konsultasi & Komunitas
          </NavLink>

          <div className="sidebar-label">Akun</div>
          <NavLink to="/petani/profil" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiUser /> Profil
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <div className="avatar">{user?.name ? user.name[0].toUpperCase() : 'P'}</div>
            <div className="meta">
              <strong>{user?.name || 'Petani'}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-block btn-sm" style={{ color: '#fbeae6' }}>
            <FiLogOut /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="shell-main">
        <header className="topbar">
          <button 
            className="btn btn-ghost btn-icon menu-btn" 
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle Menu"
          >
            <FiMenu size={22} />
          </button>
          <span className="topbar-title">Area Petani</span>
          <div className="topbar-actions">
            <span className="badge badge-success">Petani Terverifikasi</span>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
