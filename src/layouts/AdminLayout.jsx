import React from 'react';
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Home } from 'lucide-react';
import { Logo } from '../components/icons/Icons';

const AdminLayout = () => {
  const { user, profile, isLoading, logout } = useAuthStore();
  const navigate = useNavigate();

  if (isLoading) return <div className="min-h-screen bg-ff-darker flex justify-center items-center">Loading...</div>;
  if (!user || profile?.role !== 'admin') return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
           <Logo />
           <p className="text-xs text-gray-500 mt-2 uppercase font-bold tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg text-ff-yellow hover:bg-gray-700 transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <ShoppingBag size={20} />
            <span className="font-semibold">Products</span>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <Users size={20} />
            <span className="font-semibold">Users & Sellers</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            <span className="font-semibold">Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
           <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
             <Home size={20} />
             <span className="font-semibold">Back to Store</span>
           </Link>
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors">
             <LogOut size={20} />
             <span className="font-semibold">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-black border-b border-gray-800 p-4 flex justify-between items-center md:hidden">
            <Logo />
            <button className="text-gray-400">Menu</button>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
