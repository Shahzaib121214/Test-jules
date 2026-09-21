import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useStoreSettings } from '../../store/useStoreSettings';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { settings, setSettings } = useStoreSettings();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    heroTitle: '',
    heroSubtitle: '',
    currency: '',
  });

  useEffect(() => {
    setFormData({
      storeName: settings.storeName || '',
      heroTitle: settings.heroTitle || '',
      heroSubtitle: settings.heroSubtitle || '',
      currency: settings.currency || 'PKR',
    });
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, settings doc ID could be 'global' or similar
      const docRef = doc(db, 'settings', 'global');
      await setDoc(docRef, formData, { merge: true });
      setSettings(formData);
      toast.success('Store settings updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Store Configuration</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Store Name"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
            <Input
              label="Store Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Homepage Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Hero Title"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Hero Subtitle
              </label>
              <textarea
                name="heroSubtitle"
                rows="3"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={formData.heroSubtitle}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={loading}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
