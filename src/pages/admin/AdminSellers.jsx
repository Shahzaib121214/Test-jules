import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { VerifiedBadge } from '../../components/icons';
import toast from 'react-hot-toast';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'seller'));
      const snapshot = await getDocs(q);
      setSellers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async (sellerId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, 'users', sellerId), { isVerified: newStatus });
      setSellers(sellers.map(s => s.id === sellerId ? { ...s, isVerified: newStatus } : s));
      toast.success(newStatus ? 'Seller verified (Blue Badge granted)' : 'Seller verification revoked');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update verification status');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Seller Management & Verification</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400">Loading sellers...</TableCell>
                </TableRow>
              ) : sellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-400">No sellers found</TableCell>
                </TableRow>
              ) : (
                sellers.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center gap-2">
                        {s.storeName || s.name || 'Unnamed Store'}
                        {s.isVerified && <VerifiedBadge className="w-4 h-4" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{s.email}</TableCell>
                    <TableCell>
                      <Badge variant={s.isVerified ? 'success' : 'warning'}>
                        {s.isVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={s.isVerified ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleVerifyToggle(s.id, s.isVerified)}
                      >
                        {s.isVerified ? 'Revoke Badge' : 'Verify Seller'}
                      </Button>
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

export default AdminSellers;
