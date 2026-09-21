import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/EmptyState';
import { Package, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SellerOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Query only orders that belong to this seller
        const q = query(
          collection(db, 'orders'),
          where('sellerId', '==', user.uid)
        );
        const snapshot = await getDocs(q);

        const fetchedOrders = [];

        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          // Filter items belonging to this seller just to be safe
          const sellerItems = data.items?.filter(item => item.sellerId === user.uid) || [];

          if (sellerItems.length > 0) {
            fetchedOrders.push({
              id: docSnap.id,
              ...data,
              items: sellerItems
            });
          }
        });

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
        updatedAt: new Date().toISOString()
      });

      setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success("Order status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When customers purchase your products, they will appear here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Orders</h1>

      <div className="space-y-4">
        {orders.map(order => {
          const sellerTotal = order.items.reduce((acc, item) => {
            const price = item.priceSnapshot || 0;
            const discount = item.discountSnapshot || 0;
            return acc + ((price - (price * discount/100)) * item.quantity);
          }, 0);

          return (
            <Card key={order.id} className="overflow-hidden">
              <div className="bg-gray-800/50 p-4 border-b border-gray-800 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-gray-200">{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Date</p>
                    <p className="text-gray-200">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Customer</p>
                    <p className="text-gray-200">{order.customerDetails?.name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-500 text-xs mb-1">Your Revenue</p>
                    <p className="font-bold text-blue-400">Rs {sellerTotal.toFixed(2)}</p>
                  </div>
                  <Select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    options={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'cancelled', label: 'Cancelled' }
                    ]}
                    className="w-36 h-8 text-xs bg-gray-900"
                  />
                </div>
              </div>

              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-white">{item.title}</TableCell>
                        <TableCell className="text-gray-400">Rs {item.priceSnapshot}</TableCell>
                        <TableCell className="text-gray-400">{item.quantity}</TableCell>
                        <TableCell className="text-gray-300">
                          Rs {((item.priceSnapshot - (item.priceSnapshot * (item.discountSnapshot/100))) * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {order.customerDetails?.gameId && (
                   <div className="p-4 bg-blue-500/5 border-t border-gray-800 text-sm">
                     <span className="text-gray-400">Customer Game ID provided: </span>
                     <span className="font-mono text-blue-400 font-bold">{order.customerDetails.gameId}</span>
                   </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SellerOrders;
