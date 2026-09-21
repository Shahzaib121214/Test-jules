import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { uploadImageToImgBB } from '../../lib/imgbb';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '0',
    stock: '1',
    categoryId: 'Free Fire',
    SKU: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadImageToImgBB(file));
      const urls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...urls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (images.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        SKU: formData.SKU,
        images: images,
        sellerId: user.uid,
        sellerName: profile?.storeName || profile?.name || 'Verified Seller',
        // Require admin approval by default for security
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'products'), productData);
      toast.success("Product submitted for approval!");
      navigate('/seller/products');
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <Button variant="ghost" onClick={() => navigate('/seller/products')}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Product Title *"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Free Fire 100 Diamonds Topup"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows="6"
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (Rs) *"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleChange}
                  />
                  <Input
                    label="Discount (%)"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Stock Quantity *"
                    name="stock"
                    type="number"
                    min="1"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                  />
                  <Input
                    label="SKU (Optional)"
                    name="SKU"
                    value={formData.SKU}
                    onChange={handleChange}
                    placeholder="Store Keeping Unit"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  label="Category *"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  options={[
                    { value: 'Free Fire', label: 'Free Fire' },
                    { value: 'PUBG', label: 'PUBG Mobile' },
                    { value: 'Gift Cards', label: 'Gift Cards' },
                    { value: 'Accounts', label: 'Game Accounts' },
                    { value: 'Other', label: 'Other' },
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images *</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {images.length < 4 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-500 bg-gray-900 flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                        {uploading ? (
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-gray-500 mb-2" />
                            <span className="text-xs text-gray-500">Add Image</span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">First image will be the cover. Max 4 images.</p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full h-12 text-lg" isLoading={loading}>
              Submit Product
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              All new products require admin approval before appearing in the store.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
