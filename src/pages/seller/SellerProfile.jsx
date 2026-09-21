import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { VerifiedBadge } from '../../components/icons';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SellerProfile = () => {
  const { user, profile, setProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    contactEmail: '',
    phone: '',
    withdrawMethod: '',
    withdrawAccount: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        storeName: profile.storeName || '',
        storeDescription: profile.storeDescription || '',
        contactEmail: profile.contactEmail || user?.email || '',
        phone: profile.phone || '',
        withdrawMethod: profile.withdrawMethod || '',
        withdrawAccount: profile.withdrawAccount || ''
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, formData);
      setProfile({ ...profile, ...formData });
      toast.success('Store profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Store Settings</h1>

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                Verification Status
                {profile?.isVerified && <VerifiedBadge className="w-5 h-5" />}
              </h2>
              <p className="text-sm text-gray-400">
                {profile?.isVerified
                  ? "Your store is verified. You have access to all seller features."
                  : "Your store is currently unverified. Admin approval is required for the blue badge."}
              </p>
            </div>
            {!profile?.isVerified && (
              <Badge variant="warning" className="shrink-0 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Unverified
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Public Store Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Store Name *"
              name="storeName"
              required
              value={formData.storeName}
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Store Description
              </label>
              <textarea
                name="storeDescription"
                rows="4"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={formData.storeDescription}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Support Email"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
              />
              <Input
                label="Support Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Withdrawal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preferred Withdrawal Method"
                name="withdrawMethod"
                placeholder="e.g., Easypaisa, JazzCash, Bank Transfer"
                value={formData.withdrawMethod}
                onChange={handleChange}
              />
              <Input
                label="Account Number / IBAN"
                name="withdrawAccount"
                value={formData.withdrawAccount}
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              This information is kept secure and only visible to administrators for payout purposes.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={loading}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SellerProfile;
