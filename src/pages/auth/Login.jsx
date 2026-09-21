import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { Logo } from '../../components/icons/Icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const profileData = userDoc.data();
        setUser(user);
        setProfile(profileData);

        toast.success('Login successful!');
        if (profileData.role === 'admin') navigate('/admin');
        else if (profileData.role === 'seller') navigate('/seller');
        else navigate('/');
      } else {
        toast.error('User profile not found.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ff-darker flex items-center justify-center p-4">
      <div className="bg-ff-panel p-8 rounded-xl w-full max-w-md border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ff-yellow to-ff-orange"></div>
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 uppercase tracking-wider text-white">Login to your account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1 uppercase font-bold tracking-wider">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-ff-orange focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1 uppercase font-bold tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-ff-orange focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full ff-btn flex justify-center items-center py-3 mt-4 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-ff-yellow hover:underline font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
