import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, ShoppingBag, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const productsSnap = await getDocs(collection(db, 'products'));
        const ordersSnap = await getDocs(collection(db, 'orders'));

        let totalRevenue = 0;
        ordersSnap.forEach(doc => {
          const data = doc.data();
          if (data.status === 'completed' || data.paymentStatus === 'paid') {
            totalRevenue += data.total || 0;
          }
        });

        setStats({
          users: usersSnap.size,
          products: productsSnap.size,
          orders: ordersSnap.size,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading stats...</div>;

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Products', value: stats.products, icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Orders', value: stats.orders, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-ff-yellow', bg: 'bg-ff-yellow/10' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-400 text-sm">Dashboard connected to Firestore. Implement order fetching here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
