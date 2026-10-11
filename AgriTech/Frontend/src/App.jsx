import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import FarmerLayout from './layouts/FarmerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import CropInfoPage from './pages/public/CropInfoPage';
import MarketplacePage from './pages/public/MarketplacePage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyFarmsPage from './pages/farmer/MyFarmsPage';
import MyCropsPage from './pages/farmer/MyCropsPage';
import WeatherPage from './pages/farmer/WeatherPage';
import MyOrdersPage from './pages/farmer/MyOrdersPage';
import MyBookingsPage from './pages/farmer/MyBookingsPage';
import CommunityPage from './pages/farmer/CommunityPage';
import ProfilePage from './pages/farmer/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/informasi-tanaman" element={<CropInfoPage />} />
        <Route path="/produk" element={<MarketplacePage />} />
        <Route path="/tentang-kami" element={<LandingPage />} />
      </Route>

      {/* Auth Standalone Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Farmer Dashboard Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
        <Route path="/petani" element={<FarmerLayout />}>
          <Route index element={<Navigate to="/petani/dashboard" replace />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="kebun" element={<MyFarmsPage />} />
          <Route path="tanaman" element={<MyCropsPage />} />
          <Route path="cuaca" element={<WeatherPage />} />
          <Route path="pesanan" element={<MyOrdersPage />} />
          <Route path="booking" element={<MyBookingsPage />} />
          <Route path="komunitas" element={<CommunityPage />} />
          <Route path="profil" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="farms" element={<AdminDashboard />} />
          <Route path="products" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminDashboard />} />
          <Route path="crop-info" element={<CropInfoPage />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
