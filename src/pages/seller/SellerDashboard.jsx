import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { ShoppingBag, DollarSign, Package } from 'lucide-react';
import { VerifiedBadge } from '../../components/icons/Icons';

const SellerDashboard = () => {
  const { user, profile } = useAuthStore();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const productsQ = query(collection(db, 'products'), where('sellerId', '==', user.uid));
        const ordersQ = query(collection(db, 'orders'), where('items', 'array-contains', { sellerId: user.uid }));

        const [productsSnap, ordersSnap] = await Promise.all([
          getDocs(productsQ),
          getDocs(ordersQ)
        ]);

        // Note: the order query above is simplified and might require a custom index or
        // a different schema approach for production to calculate accurate earnings per seller

        setStats({
          products: productsSnap.size,
          orders: ordersSnap.size,
          earnings: 0 // calculate based on actual completed orders
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Welcome, {profile?.displayName}
            {profile?.isVerified && <VerifiedBadge />}
          </h1>
          {!profile?.isVerified && (
            <p className="text-yellow-500 text-sm mt-1">Your account is pending verification. Some features may be limited.</p>
          )}
        </div>
        <button className="bg-ff-orange hover:bg-ff-yellow hover:text-black transition-colors px-4 py-2 rounded font-bold text-white">
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
          <div className="p-4 rounded-lg bg-green-500/10 text-green-500">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">My Products</p>
            <h3 className="text-2xl font-bold">{stats.products}</h3>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
          <div className="p-4 rounded-lg bg-purple-500/10 text-purple-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Orders</p>
            <h3 className="text-2xl font-bold">{stats.orders}</h3>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
          <div className="p-4 rounded-lg bg-ff-yellow/10 text-ff-yellow">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Earnings</p>
            <h3 className="text-2xl font-bold">${stats.earnings.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
