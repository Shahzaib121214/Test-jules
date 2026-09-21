import React from 'react';
import Hero from './components/Hero';
import IdSelling from './components/IdSelling';
import ImageGallery from './components/ImageGallery';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-ff-darker text-white font-sans">
      {/* Navbar Placeholder */}
      <nav className="absolute top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent py-6 px-8 flex justify-between items-center">
        <div className="text-2xl font-black italic uppercase tracking-wider">
          Elite<span className="text-ff-orange">Fire</span>
        </div>
        <div className="hidden md:flex gap-8 font-bold uppercase text-sm tracking-widest">
          <a href="#" className="hover:text-ff-yellow transition-colors">Home</a>
          <a href="#" className="text-ff-yellow border-b-2 border-ff-yellow pb-1">Accounts</a>
          <a href="#" className="hover:text-ff-yellow transition-colors">Top Up</a>
          <a href="#" className="hover:text-ff-yellow transition-colors">Support</a>
        </div>
        <button className="bg-ff-orange text-white px-6 py-2 font-bold uppercase text-sm rounded hover:bg-ff-yellow hover:text-black transition-colors">
          Login
        </button>
      </nav>

      <Hero />
      <IdSelling />
      <ImageGallery />

      {/* Footer Placeholder */}
      <footer className="bg-black py-12 text-center border-t border-gray-900">
        <div className="text-3xl font-black italic uppercase tracking-wider mb-6">
          Elite<span className="text-ff-orange">Fire</span>
        </div>
        <p className="text-gray-500 max-w-md mx-auto text-sm">
          The most trusted marketplace for premium gaming accounts. Fast, secure, and reliable.
        </p>
        <div className="mt-8 text-xs text-gray-700">
          &copy; {new Date().getFullYear()} EliteFire Marketplace. All rights reserved. Not affiliated with Garena.
        </div>
      </footer>
    </div>
  );
}

export default App;
