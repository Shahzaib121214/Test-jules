import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Logo } from '../components/icons/Icons';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const MainLayout = () => {
  const { user, profile, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-ff-darker text-white font-sans flex flex-col">
      <nav className="sticky top-0 w-full z-50 bg-ff-darker/90 backdrop-blur-md border-b border-gray-800 py-4 px-4 md:px-8 flex justify-between items-center shadow-lg">
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden md:flex gap-8 font-bold uppercase text-sm tracking-widest">
          <Link to="/" className="hover:text-ff-yellow transition-colors">Home</Link>
          <Link to="/store" className="hover:text-ff-yellow transition-colors">Store</Link>
          <Link to="/categories" className="hover:text-ff-yellow transition-colors">Categories</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-white hover:text-ff-yellow transition-colors">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-ff-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
             <div className="flex items-center gap-4 ml-4 border-l border-gray-700 pl-4">
               <Link to="/profile" className="flex items-center gap-2 hover:text-ff-yellow transition-colors">
                 <User size={20} />
                 <span className="hidden md:inline font-bold text-sm">{profile?.displayName || 'User'}</span>
               </Link>
               {profile?.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold bg-purple-600 px-2 py-1 rounded text-white hover:bg-purple-500">Admin</Link>
               )}
               {profile?.role === 'seller' && (
                  <Link to="/seller" className="text-xs font-bold bg-green-600 px-2 py-1 rounded text-white hover:bg-green-500">Seller</Link>
               )}
               <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                 <LogOut size={20} />
               </button>
             </div>
          ) : (
            <Link to="/login" className="bg-ff-orange text-white px-6 py-2 font-bold uppercase text-sm rounded hover:bg-ff-yellow hover:text-black transition-colors ml-4">
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-black py-12 text-center border-t border-gray-900 mt-auto">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <p className="text-gray-500 max-w-md mx-auto text-sm">
          The most trusted marketplace for premium gaming accounts. Fast, secure, and reliable.
        </p>
        <div className="mt-8 text-xs text-gray-700">
          &copy; {new Date().getFullYear()} RehixPK Marketplace. All rights reserved. Not affiliated with Garena.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
