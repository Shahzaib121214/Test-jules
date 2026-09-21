import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Cart = () => {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black uppercase italic mb-4">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added any items yet.</p>
        <Link to="/store" className="ff-btn inline-block">Browse Store</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-black uppercase italic mb-8">
        Your <span className="ff-gradient-text">Cart</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-ff-panel p-4 rounded-xl border border-gray-800 flex items-center gap-4">
              <img
                src={item.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop"}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg border border-gray-700"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold line-clamp-1">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                <div className="text-ff-yellow font-bold text-lg">${item.discountPrice || item.price}</div>
              </div>

              <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="p-1 hover:text-ff-orange transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:text-ff-orange transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors ml-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-red-500/50"
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3">
          <div className="bg-ff-panel p-6 rounded-xl border border-gray-800 sticky top-24">
            <h3 className="text-xl font-bold mb-6 uppercase border-b border-gray-700 pb-4">Order Summary</h3>

            <div className="space-y-3 mb-6 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-8">
              <span className="text-lg font-bold uppercase">Total</span>
              <span className="text-3xl font-black text-ff-yellow">${getCartTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full ff-btn py-4 flex justify-center items-center gap-2 uppercase tracking-wider text-lg"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
