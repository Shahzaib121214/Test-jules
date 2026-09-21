import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCartStore } from '../../store/useCartStore';
import { Shield, Star, CheckCircle, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { VerifiedBadge } from '../../components/icons/Icons';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Product not found");
          navigate('/store');
        }
      } catch (error) {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading product details...</div>;
  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart!');
  };

  const currentPrice = product.discountPrice || product.price;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-ff-panel rounded-2xl border border-gray-800 overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 h-[400px] md:h-auto relative">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="mb-2">
             <span className="bg-gray-800 text-ff-yellow text-xs px-2 py-1 rounded uppercase font-bold tracking-wider">
               {product.category}
             </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">{product.title}</h1>

          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <span>Sold by:</span>
            <span className="font-bold text-white">{product.sellerName || 'Verified Seller'}</span>
            {product.sellerVerified && <VerifiedBadge />}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col">
              {product.discountPrice && (
                <span className="text-lg text-gray-500 line-through">${product.price}</span>
              )}
              <span className="text-5xl font-black text-ff-yellow">${currentPrice}</span>
            </div>
            {product.discountPrice && (
              <span className="bg-red-500/20 text-red-500 font-bold px-3 py-1 rounded border border-red-500/50">
                SAVE ${product.price - product.discountPrice}
              </span>
            )}
          </div>

          <div className="prose prose-invert mb-8 max-w-none text-gray-400">
            <p>{product.description || 'Premium gaming asset verified and secured by RehixPK.'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Shield className="text-green-500 w-5 h-5" /> Secured Transaction
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle className="text-blue-500 w-5 h-5" /> Instant Delivery
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-800 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 border-2 border-ff-orange text-ff-orange font-bold py-4 rounded hover:bg-ff-orange hover:text-white transition-colors flex justify-center items-center gap-2 uppercase tracking-wider"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
              className="flex-1 ff-btn py-4 flex justify-center items-center uppercase tracking-wider"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
