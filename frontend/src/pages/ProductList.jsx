import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/SkeletonCard';
import { getMediaUrl } from '../utils/getMediaUrl';

  const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCartStore();
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const { user } = useAuth();
  const selectedCategory = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';


  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
  fetchProducts();
}, [search, selectedCategory, urlSearch]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories/');
      setCategories(res.data.results || res.data);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
  setLoading(true);
  try {
    const params = {};
    if (search) params.search = search;
    if (urlSearch) params.search = urlSearch;  // ← add this
    if (selectedCategory) params.category__slug = selectedCategory;
    const res = await api.get('/products/', { params });
    setProducts(res.data.results || res.data);
  } catch {
    toast.error('Failed to load products');
  } finally {
    setLoading(false);
  }
};

  const handleCategoryChange = (slug) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart! 🛍️');
    } catch {
      toast.error('Login to add to cart');
    }
  };

  // Find active category name
  const handleWishlistToggle = async (productId) => {
  if (!user) {
    toast.error('Please login to save to wishlist');
    return;
  }
  try {
    const res = await api.post(`/wishlist/toggle/${productId}/`);
    setWishlistedIds((prev) => {
      const updated = new Set(prev);
      if (res.data.status === 'added') {
        updated.add(productId);
      } else {
        updated.delete(productId);
      }
      return updated;
    });
    toast.success(res.data.message);
  } catch {
    toast.error('Failed to update wishlist');
  }
};

const activeCategoryName = categories.find(
  (c) => c.slug === selectedCategory
)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {activeCategoryName ? `${activeCategoryName}` : 'All Products'}
        </h1>
        {activeCategoryName && (
          <button
            onClick={() => handleCategoryChange('')}
            className="text-red-500 text-sm mt-1 hover:underline"
          >
            ← Back to all products
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">No products found in this category.</p>
          <button
            onClick={() => handleCategoryChange('')}
            className="mt-4 text-red-500 hover:underline"
          >
            View all products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group"
            >
              {product.image ? (
                <img
  src={getMediaUrl(product.image)}
  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x300?text=Oja+Market';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-300 text-4xl">
                  🛍️
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
                <h2 className="font-semibold text-gray-800 text-lg mb-1 truncate">
                  {product.name}
                </h2>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-500 font-bold text-lg">
                    ₦{Number(product.effective_price).toLocaleString()}
                  </span>
                  {product.discount_price && (
                    <span className="text-gray-400 line-through text-sm">
                      ₦{Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>
                      <div className="flex gap-2">
        <Link
          to={`/products/${product.slug}`}
          className="flex-1 text-center border border-red-400 text-red-400 rounded-lg py-1.5 text-sm hover:bg-red-50 transition"
        >
          View
        </Link>
        <button
          onClick={() => handleAddToCart(product.id)}
          disabled={!product.is_in_stock}
          className="flex-1 bg-red-500 text-white rounded-lg py-1.5 text-sm hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
  <button
    onClick={() => handleWishlistToggle(product.id)}
    className={`px-2 py-1.5 rounded-lg border transition text-sm ${
      wishlistedIds.has(product.id)
        ? 'bg-red-500 border-red-500 text-white'
        : 'border-red-300 text-red-400 hover:bg-red-50'
    }`}
  >
    {wishlistedIds.has(product.id) ? '❤️' : '🤍'}
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

export default ProductList;