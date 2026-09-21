import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { Logo } from '../../components/icons/Icons';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: serverTimestamp(),
        ...(role === 'seller' ? { isVerified: false } : {})
      };

      await setDoc(doc(db, 'users', user.uid), profileData);

      setUser(user);
      setProfile(profileData);

      toast.success('Registration successful!');
      if (role === 'seller') navigate('/seller');
      else navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ff-darker flex items-center justify-center p-4 py-12">
      <div className="bg-ff-panel p-8 rounded-xl w-full max-w-md border border-gray-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ff-yellow to-ff-orange"></div>
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 uppercase tracking-wider text-white">Create an Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1 uppercase font-bold tracking-wider">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-ff-orange focus:outline-none transition-colors"
            />
          </div>
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
          <div>
            <label className="block text-sm text-gray-400 mb-1 uppercase font-bold tracking-wider">Account Type</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  className="text-ff-orange focus:ring-ff-orange"
                />
                <span className="text-white">Customer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === 'seller'}
                  onChange={() => setRole('seller')}
                  className="text-ff-orange focus:ring-ff-orange"
                />
                <span className="text-white">Seller</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full ff-btn flex justify-center items-center py-3 mt-6 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-ff-yellow hover:underline font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
