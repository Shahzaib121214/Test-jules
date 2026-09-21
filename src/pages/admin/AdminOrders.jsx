import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(fetchedOrders);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, field, value) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { [field]: value });
      setOrders(orders.map(o => o.id === orderId ? { ...o, [field]: value } : o));
      toast.success(`Order ${field.replace('Status', '')} updated`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Order & Payment Management</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID / Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Order Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">Loading orders...</TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">No orders found</TableCell>
                </TableRow>
              ) : (
                orders.map(o => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <div className="font-mono text-gray-300 text-sm mb-1">{o.id.slice(-8).toUpperCase()}</div>
                      <div className="text-xs text-gray-500">{format(new Date(o.createdAt), 'MMM dd, yyyy')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-200">{o.customerDetails?.name || 'Unknown'}</div>
                      <div className="text-xs text-blue-400 font-mono mt-1">{o.paymentMethod} {o.paymentReference && `(${o.paymentReference})`}</div>
                    </TableCell>
                    <TableCell className="text-gray-200 font-medium">Rs {o.total?.toFixed(2)}</TableCell>
                    <TableCell>
                       <Select
                        value={o.paymentStatus}
                        onChange={(e) => handleStatusUpdate(o.id, 'paymentStatus', e.target.value)}
                        options={[
                          { value: 'payment_verification_pending', label: 'Verifying' },
                          { value: 'paid', label: 'Paid' },
                          { value: 'rejected', label: 'Rejected' },
                        ]}
                        className={`w-32 h-8 text-xs ${
                          o.paymentStatus === 'paid' ? 'border-green-500/50 text-green-400' :
                          o.paymentStatus === 'payment_verification_pending' ? 'border-yellow-500/50 text-yellow-400' : ''
                        }`}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusUpdate(o.id, 'orderStatus', e.target.value)}
                        options={[
                          { value: 'pending', label: 'Pending' },
                          { value: 'processing', label: 'Processing' },
                          { value: 'completed', label: 'Completed' },
                          { value: 'cancelled', label: 'Cancelled' },
                        ]}
                        className="w-32 h-8 text-xs"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
