import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, Store, Package, DollarSign } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    products: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, productsSnap, ordersSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'orders'))
        ]);

        const usersCount = usersSnap.size;
        const sellersCount = usersSnap.docs.filter(doc => doc.data().role === 'seller').length;
        const productsCount = productsSnap.size;

        let totalRevenue = 0;
        ordersSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.paymentStatus === 'paid' || data.orderStatus === 'completed') {
            totalRevenue += data.total || 0;
          }
        });

        setStats({
          users: usersCount,
          sellers: sellersCount,
          products: productsCount,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, loading }) => (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Active Sellers"
          value={stats.sellers}
          icon={Store}
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={Package}
          loading={loading}
        />
        <StatCard
          title="Platform Revenue"
          value={`Rs ${stats.revenue.toFixed(2)}`}
          icon={DollarSign}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-sm text-gray-400 text-center py-8">
               No recent system alerts or audit logs.
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
