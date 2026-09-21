import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent } from '../../components/ui/Card';
import { DollarSign, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { format } from 'date-fns';
import { EmptyState } from '../../components/ui/EmptyState';

const SellerEarnings = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingClearance: 0,
    availableForWithdrawal: 0,
    recentTransactions: []
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('sellerId', '==', user.uid)
        );
        const snapshot = await getDocs(q);

        let total = 0;
        let pending = 0;
        let available = 0;
        const transactions = [];

        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          const sellerItems = data.items?.filter(item => item.sellerId === user.uid) || [];

          if (sellerItems.length > 0) {
            const orderTotal = sellerItems.reduce((acc, item) => {
              const price = item.priceSnapshot || 0;
              const discount = item.discountSnapshot || 0;
              return acc + ((price - (price * discount/100)) * item.quantity);
            }, 0);

            total += orderTotal;

            if (data.orderStatus === 'completed' && data.paymentStatus === 'paid') {
              available += orderTotal;
            } else {
              pending += orderTotal;
            }

            transactions.push({
              id: docSnap.id,
              date: data.createdAt,
              amount: orderTotal,
              status: data.orderStatus === 'completed' ? 'completed' : 'pending'
            });
          }
        });

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        setStats({
          totalEarnings: total,
          pendingClearance: pending,
          availableForWithdrawal: available,
          recentTransactions: transactions.slice(0, 10) // Show top 10
        });

      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading earnings data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Earnings & Payouts</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-gray-900 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-blue-400">Available to Withdraw</p>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-white">Rs {stats.availableForWithdrawal.toFixed(2)}</h3>
            <p className="text-xs text-gray-400 mt-2">Funds cleared from completed orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-400">Pending Clearance</p>
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">Rs {stats.pendingClearance.toFixed(2)}</h3>
            <p className="text-xs text-gray-500 mt-2">Orders in progress or awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-400">Net Earnings</p>
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">Rs {stats.totalEarnings.toFixed(2)}</h3>
            <p className="text-xs text-gray-500 mt-2">Total lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Recent Transactions</h2>
        <Card>
          <CardContent className="p-0">
            {stats.recentTransactions.length === 0 ? (
              <EmptyState
                icon={DollarSign}
                title="No transactions yet"
                description="Your recent sales and earnings will appear here."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs text-gray-400">{tx.id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell className="text-gray-300">{format(new Date(tx.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-gray-300">Sale</TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-white">
                        + Rs {tx.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple Clock Icon fallback if missing
const Clock = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default SellerEarnings;
