import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <div className="p-8">Loading products...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button className="bg-ff-orange hover:bg-ff-yellow hover:text-black transition-colors px-4 py-2 rounded font-bold text-white">
          Add New Product
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700">
              <th className="p-4 font-semibold text-gray-400">Product</th>
              <th className="p-4 font-semibold text-gray-400">Price</th>
              <th className="p-4 font-semibold text-gray-400">Category</th>
              <th className="p-4 font-semibold text-gray-400">Seller</th>
              <th className="p-4 font-semibold text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">No products found.</td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.imageUrl || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium">{product.title}</span>
                  </td>
                  <td className="p-4">${product.discountPrice || product.price}</td>
                  <td className="p-4"><span className="bg-gray-700 px-2 py-1 rounded text-xs">{product.category}</span></td>
                  <td className="p-4 text-gray-400">{product.sellerName || 'Admin'}</td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-blue-400 hover:text-blue-300 mx-1"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:text-red-300 mx-1"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
