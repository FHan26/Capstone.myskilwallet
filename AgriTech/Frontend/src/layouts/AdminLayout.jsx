import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMenu, 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiCalendar, 
  FiBookOpen, 
  FiLogOut, 
  FiLayers, 
  FiShield 
} from 'react-icons/fi';
import { GiPlantRoots } from 'react-icons/gi';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <div 
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="brand brand-light">
            <div className="brand-mark" style={{ background: '#3b7046' }}>
              <GiPlantRoots />
            </div>
            <span>Agri<em>Admin</em></span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-label">Panel Administrator</div>
          <NavLink to="/admin/dashboard" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiHome /> Dashboard Admin
          </NavLink>
          <NavLink to="/admin/users" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiUsers /> Kelola Pengguna
          </NavLink>
          <NavLink to="/admin/farms" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiLayers /> Ringkasan Lahan
          </NavLink>
          <NavLink to="/admin/products" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiShoppingBag /> Inventaris Produk
          </NavLink>
          <NavLink to="/admin/orders" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiShoppingBag /> Kelola Pesanan
          </NavLink>
          <NavLink to="/admin/bookings" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiCalendar /> Kelola Booking
          </NavLink>
          <NavLink to="/admin/crop-info" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <FiBookOpen /> Info & Hama Tanaman
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            <div className="avatar" style={{ background: '#b3412f' }}>A</div>
            <div className="meta">
              <strong>{user?.name || 'Administrator'}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-block btn-sm" style={{ color: '#fbeae6' }}>
            <FiLogOut /> Keluar
          </button>
        </div>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <button 
            className="btn btn-ghost btn-icon menu-btn" 
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={22} />
          </button>
          <span className="topbar-title">Dashboard Administrator</span>
          <div className="topbar-actions">
            <span className="badge badge-danger"><FiShield /> Admin Mode</span>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
