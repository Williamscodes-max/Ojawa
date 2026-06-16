import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/login');
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/');
      setOrders(res.data.results || res.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading orders...</div>
  );

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">📦</p>
        <p className="text-gray-500 text-lg mb-4">You have no orders yet</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders 📦</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">

            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b gap-2">
              <div>
                <Link
                  to={`/orders/${order.id}`}
                  className="font-bold text-gray-800 hover:text-red-500 transition"
                  style={{ textDecoration: 'none' }}
                >
                  Order #{order.id} →
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.created_at).toLocaleDateString('en-NG', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.is_paid
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {order.is_paid ? '✅ Paid' : '❌ Unpaid'}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>₦{Number(item.total_price).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                📍 {order.city}, {order.state}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-800">
                  ₦{Number(order.total_price).toLocaleString()}
                </span>
                <Link
                  to={`/orders/${order.id}`}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                  style={{ textDecoration: 'none' }}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;