import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCartStore();

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/products/${slug}/reviews/`);
      setReviews(res.data.results || res.data);
    } catch {
      console.error('Failed to load reviews');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}/`);
        setProduct(res.data);
        fetchReviews();
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (user && product) {
      api.get(`/wishlist/check/${product.id}/`)
        .then((res) => setIsWishlisted(res.data.is_wishlisted))
        .catch(() => {});
    }
  }, [user, product]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast.success('Added to cart! 🛍️');
    } catch {
      toast.error('Login to add to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to save to wishlist');
      return;
    }
    try {
      const res = await api.post(`/wishlist/toggle/${product.id}/`);
      setIsWishlisted(res.data.status === 'added');
      toast.success(res.data.message);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${slug}/reviews/`, reviewForm);
      toast.success('Review submitted! ⭐');
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading...</div>
  );

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-red-500 mb-6 flex items-center gap-1 hover:underline"
      >
        ← Back
      </button>

      {/* Product Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {product.image ? (
          <img
            src={
              product.image.startsWith('http')
                ? product.image
                : `http://127.0.0.1:8000${product.image}`
            }
            alt={product.name}
            className="w-full md:w-1/2 h-80 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x300?text=Oja+Market';
            }}
          />
        ) : (
          <div className="w-full md:w-1/2 h-80 bg-gray-100 flex items-center justify-center text-gray-400 text-6xl">
            🛍️
          </div>
        )}

        <div className="p-8 flex flex-col justify-between flex-1">
          <div>
            <p className="text-sm text-gray-400 mb-1">{product.category?.name}</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-red-500">
                ₦{Number(product.effective_price).toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="text-gray-400 line-through text-lg">
                  ₦{Number(product.price).toLocaleString()}
                </span>
              )}
            </div>

            <p className={`text-sm font-medium mb-6 ${product.is_in_stock ? 'text-green-500' : 'text-red-400'}`}>
              {product.is_in_stock
                ? `✅ In Stock (${product.stock} available)`
                : '❌ Out of Stock'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {product.is_in_stock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-500 text-white rounded-lg py-3 font-semibold hover:bg-red-600 transition"
                >
                  Add to Cart 🛍️
                </button>
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`w-full py-3 rounded-lg border-2 transition font-semibold flex items-center justify-center gap-2 ${
                isWishlisted
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-red-300 text-red-400 hover:bg-red-50'
              }`}
            >
              {isWishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {/* Review Form */}
        {user ? (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{'⭐'.repeat(r)} ({r})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={3}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review ⭐'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-yellow-700">
              Please{' '}
              <a href="/login" className="text-red-500 font-medium hover:underline">
                login
              </a>{' '}
              to write a review
            </p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">⭐</p>
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{review.user_name}</p>
                    <p className="text-yellow-400">{'⭐'.repeat(review.rating)}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                {review.comment && (
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;