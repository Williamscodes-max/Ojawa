import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useCartStore from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import heroImage from '../assets/hero.jpg';
import SkeletonCard from '../components/SkeletonCard';

const ProductCard = ({ product, onAddToCart, onWishlistToggle, wishlistedIds }) => (
  <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group flex-shrink-0 w-56">
    {product.image ? (
      <img
        src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`}
        alt={product.name}
        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Oja+Market'; }}
      />
    ) : (
      <div className="w-full h-40 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-300 text-4xl">
        🛍️
      </div>
    )}
    <div className="p-3">
      <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
      <h3 className="font-semibold text-gray-800 truncate text-sm mb-1">{product.name}</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-red-500 font-bold text-sm">
          ₦{Number(product.effective_price).toLocaleString()}
        </span>
        {product.discount_price && (
          <span className="text-gray-400 line-through text-xs">
            ₦{Number(product.price).toLocaleString()}
          </span>
        )}
      </div>
      <div className="flex gap-1">
        <Link
          to={`/products/${product.slug}`}
          className="flex-1 text-center border border-red-400 text-red-400 rounded-lg py-1 text-xs hover:bg-red-50 transition"
        >
          View
        </Link>
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={!product.is_in_stock}
          className="flex-1 bg-red-500 text-white rounded-lg py-1 text-xs hover:bg-red-600 transition disabled:opacity-50"
        >
          {product.is_in_stock ? 'Add' : 'Sold Out'}
        </button>
        <button
          onClick={() => onWishlistToggle(product.id)}
          className={`px-2 py-1 rounded-lg border transition text-xs ${
            wishlistedIds?.has(product.id)
              ? 'bg-red-500 border-red-500 text-white'
              : 'border-red-300 text-red-400 hover:bg-red-50'
          }`}
        >
          {wishlistedIds?.has(product.id) ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  </div>
);


const getCategoryIcon = (slug) => {
  const icons = {
    'fashion': '👗',
    'food-drinks': '🍲',
    'food': '🍲',
    'drinks': '🥤',
    'beauty': '💄',
    'electronics': '📱',
    'art-crafts': '🎨',
    'art': '🎨',
    'crafts': '🎨',
    'home-living': '🏠',
    'home': '🏠',
    'shoes': '👟',
    'bags': '👜',
    'jewelry': '💍',
    'watches': '⌚',
    'kids': '🧸',
    'sports': '⚽',
    'books': '📚',
    'music': '🎵',
    'health': '💊',
    'garden': '🌿',
    'automotive': '🚗',
    'phones': '📱',
    'computers': '💻',
    'gaming': '🎮',
    'travel': '✈️',
    'pets': '🐾',
  };
  return icons[slug] || '🛍️';
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState(new Set());
  const { addToCart } = useCartStore();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [featuredRes, newRes, catRes] = await Promise.all([
          api.get('/products/featured/'),
          api.get('/products/new-arrivals/'),
          api.get('/products/categories/'),
        ]);
        setFeatured(featuredRes.data);
        setNewArrivals(newRes.data);
        setCategories(catRes.data.results || catRes.data);
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    if (user) {
      api.get('/wishlist/')
        .then((res) => {
          const ids = new Set(
            (res.data.results || res.data).map((item) => item.product.id)
          );
          setWishlistedIds(ids);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart! 🛍️');
    } catch {
      toast.error('Please login to add to cart');
    }
  };

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

  return (
    <div>
      {/* Hero Banner */}
      <div
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 90%, #922b21 100%)' }}
        className="text-white py-16 px-8"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
              🇳🇬 Nigeria's Favourite Market
            </span>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Shop the Best of <span className="text-red-400">Nigeria</span>
            </h1>
            <p className="text-lg opacity-80 mb-8">
              Discover authentic Nigerian products — fashion, food, art, and more.
              Delivered to your doorstep.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/products"
                className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition"
              >
                Shop Now →
              </Link>
              <Link
                to="/register"
                className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-gray-800 transition"
              >
                Join Free
              </Link>
            </div>
            <div className="flex gap-6 mt-8 flex-wrap">
              {[
                { icon: '🚚', text: 'Free Delivery' },
                { icon: '🔒', text: 'Secure Payment' },
                { icon: '↩️', text: 'Easy Returns' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-sm opacity-80">
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center relative">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 blur-3xl"></div>
            <img
              src={heroImage}
              alt="Happy shopper"
              className="rounded-2xl shadow-2xl w-full max-w-sm object-cover h-96 relative z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80';
              }}
            />
            <div className="absolute bottom-6 left-4 bg-white text-gray-800 rounded-xl shadow-lg p-3 z-20">
              <p className="text-xs text-gray-500">Happy Customers</p>
              <p className="font-bold text-red-500">500+ ⭐⭐⭐⭐⭐</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-red-500 text-white py-4">
        <div className="max-w-5xl mx-auto grid grid-cols-3 text-center">
          {[
            { value: '1000+', label: 'Products' },
            { value: '500+', label: 'Happy Customers' },
            { value: '24/7', label: 'Support' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition hover:-translate-y-1"
              style={{ textDecoration: 'none' }}
            >
              <div className="text-3xl mb-2">{getCategoryIcon(cat.slug)}</div>
              <p className="text-sm font-medium text-gray-700">{cat.name}</p>
            </Link>
          ))}
          </div>
        </div>
      )}

      {/* Featured Products Slider */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800"> Featured Products</h2>
          <Link to="/products" className="text-red-500 hover:underline text-sm">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-56">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-gray-400 text-sm">No featured products yet.</p>
        ) : (
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                wishlistedIds={wishlistedIds}
              />
            ))}
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div
          style={{ background: 'linear-gradient(135deg, #1a1a2e, #e94560)' }}
          className="rounded-2xl text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-3xl font-bold mb-2">Free Delivery Today! 🚚</h3>
            <p className="opacity-80">On all orders above ₦10,000. Shop now and save!</p>
          </div>
          <Link
            to="/products"
            className="bg-white text-red-500 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition whitespace-nowrap"
          >
            Shop Now →
          </Link>
        </div>
      </div>

      {/* New Arrivals Slider */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800"> New Arrivals</h2>
          <Link to="/products" className="text-red-500 hover:underline text-sm">
            View All →
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-56">
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : newArrivals.length === 0 ? (
          <p className="text-gray-400 text-sm">No new arrivals yet.</p>
        ) : (
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleWishlistToggle}
                wishlistedIds={wishlistedIds}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 mt-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🚚', title: 'Fast Delivery', desc: 'We deliver across Nigeria quickly and safely.' },
            { icon: '💳', title: 'Secure Payment', desc: "Pay safely with Paystack — Nigeria's #1 gateway." },
            { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free return policy on all items.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow p-6">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-800 text-white py-12 text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to start shopping?</h3>
        <p className="text-gray-400 mb-6">Join thousands of Nigerians shopping on Ọjà-Wá</p>
        <Link
          to="/register"
          className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition"
        >
          Create Free Account →
        </Link>
      </div>
    </div>
  );
};

export default Home;