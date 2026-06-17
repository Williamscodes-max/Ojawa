import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getMediaUrl } from '../utils/getMediaUrl';

const Cart = () => {
  const { cart, fetchCart, removeFromCart, updateQuantity, loading } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleQuantity = async (itemId, quantity) => {
    try {
      await updateQuantity(itemId, quantity);
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">Please login to view your cart</p>
        <Link to="/login" className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
          Login
        </Link>
      </div>
    );
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <Link to="/products" className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart 🛒</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
              {item.product.image ? (
               <img
          src={getMediaUrl(item.product.image)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/100x100?text=Oja';
          }}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                <p className="text-red-500 font-bold">
                  ₦{Number(item.product.effective_price).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 font-bold"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>
              <p className="font-bold text-gray-700 w-24 text-right">
                ₦{Number(item.total_price).toLocaleString()}
              </p>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-400 hover:text-red-600 text-xl ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-6 h-fit w-full lg:w-80">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Items ({cart.total_items})</span>
            <span>₦{Number(cart.total_price).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Delivery</span>
            <span className="text-green-500">Free</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-800 mb-6">
            <span>Total</span>
            <span>₦{Number(cart.total_price).toLocaleString()}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-red-500 text-white rounded-lg py-3 font-semibold hover:bg-red-600 transition"
          >
            Proceed to Checkout →
          </button>
          <Link
            to="/products"
            className="block text-center text-red-500 mt-3 text-sm hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;