import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (!user) navigate('/login');
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist/');
      setWishlist(res.data.results || res.data);
    } catch {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.post(`/wishlist/toggle/${productId}/`);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch {
      toast.error('Failed to remove');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart! 🛍️');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading wishlist...</div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">❤️</p>
          <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
          <Link
            to="/products"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(({ id, product }) => (
            <div key={id} className="bg-white rounded-xl shadow overflow-hidden">
              {product.image ? (
                <img
                  src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Oja+Market'; }}
                />
              ) : (
                <div className="w-full h-48 bg-red-50 flex items-center justify-center text-4xl">
                  🛍️
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
                <h3 className="font-semibold text-gray-800 truncate mb-1">{product.name}</h3>
                <p className="text-red-500 font-bold mb-3">
                  ₦{Number(product.effective_price).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm hover:bg-red-600 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="px-3 py-2 border border-red-300 text-red-400 rounded-lg hover:bg-red-50 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;