import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Package, ExternalLink, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const Orders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort client-side by date descending
        fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    const variants = {
      pending: { color: 'warning', icon: Clock, label: 'Pending' },
      payment_verification_pending: { color: 'warning', icon: Clock, label: 'Verifying Payment' },
      processing: { color: 'primary', icon: Package, label: 'Processing' },
      completed: { color: 'success', icon: CheckCircle2, label: 'Completed' },
      cancelled: { color: 'danger', icon: XCircle, label: 'Cancelled' },
      refunded: { color: 'default', icon: XCircle, label: 'Refunded' },
    };

    const config = variants[status] || { color: 'default', icon: Package, label: status };
    const Icon = config.icon;

    return (
      <Badge variant={config.color} className="flex items-center gap-1 py-1 px-2.5">
        <Icon className="w-3 h-3" /> {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders. Start shopping to see your history here."
          action={
            <Link to="/store">
              <Button>Browse Store</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:border-gray-700 transition-colors">
              <div className="bg-gray-800/50 p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Order Placed</p>
                    <p className="font-medium text-gray-200">
                      {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Total</p>
                    <p className="font-medium text-gray-200">Rs {order.total?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-gray-300">{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {getStatusBadge(order.orderStatus || order.paymentStatus)}
                  <Link to={`/order/${order.id}`} className="ml-auto sm:ml-0">
                    <Button variant="secondary" size="sm" className="hidden sm:flex">
                      View Details
                    </Button>
                    <Button variant="ghost" size="icon" className="sm:hidden">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shrink-0 flex items-center justify-center">
                         <Package className="w-8 h-8 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.productId}`} className="font-medium text-white hover:text-blue-400 truncate block">
                          {item.title}
                        </Link>
                        <p className="text-sm text-gray-400 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-medium text-gray-300 whitespace-nowrap">
                         Rs {item.priceSnapshot * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
