import React, { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useProductStore } from '../../store/useProductStore';
import { Link } from 'react-router-dom';
import { Shield, Star, Clock } from 'lucide-react';
import { VerifiedBadge } from '../../components/icons/Icons';

const Store = () => {
  const { products, setProducts, isLoading, setLoading } = useProductStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [setProducts, setLoading]);

  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-8">
        Gaming <span className="ff-gradient-text">Store</span>
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-ff-panel rounded-xl border border-gray-800">
          <p className="text-gray-400">No products found in the store.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block">
              <div className="bg-ff-panel rounded-xl overflow-hidden border border-gray-800 hover:border-ff-orange transition-colors duration-300 group relative">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-ff-panel to-transparent z-10"></div>
                  <img
                    src={product.imageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-sm text-ff-orange text-xs px-2 py-1 rounded border border-gray-600 font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 relative">
                  <h3 className="text-xl font-bold mb-1 line-clamp-1 group-hover:text-ff-yellow transition-colors">{product.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                    By {product.sellerName || 'Verified Seller'}
                    {product.sellerVerified && <VerifiedBadge className="w-4 h-4" />}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                    <div className="flex flex-col">
                      {product.discountPrice && (
                        <span className="text-xs text-gray-500 line-through">${product.price}</span>
                      )}
                      <span className="text-2xl font-black text-white">${product.discountPrice || product.price}</span>
                    </div>
                    <button className="bg-ff-darker hover:bg-ff-orange text-white font-bold py-2 px-4 rounded transition-colors text-sm uppercase">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
