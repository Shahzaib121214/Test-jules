import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login first');

    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        items: items.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
          sellerId: item.sellerId || 'admin'
        })),
        subtotal: getCartTotal(),
        total: getCartTotal(),
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/profile'); // Redirect to orders/profile
    } catch (error) {
      toast.error('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black uppercase italic mb-8 text-center">
        Secure <span className="ff-gradient-text">Checkout</span>
      </h1>

      <div className="bg-ff-panel p-8 rounded-xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Payment Method</h2>

        <div className="p-4 border border-ff-yellow rounded-lg bg-ff-yellow/5 mb-8">
          <p className="text-ff-yellow font-bold mb-2">Manual Payment Verification</p>
          <p className="text-sm text-gray-400">
            For this demonstration, orders are placed in a 'pending' state. Admins will manually verify payments.
          </p>
        </div>

        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-gray-300">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{item.quantity}x</span>
                <span>{item.title}</span>
              </div>
              <span>${((item.discountPrice || item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-xl font-bold">
            <span>Total to pay</span>
            <span className="text-ff-yellow">${getCartTotal().toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full ff-btn py-4 text-xl uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
