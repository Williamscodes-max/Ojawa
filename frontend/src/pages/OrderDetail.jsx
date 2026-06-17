import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { getMediaUrl } from '../utils/getMediaUrl';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}/`);
        setOrder(res.data);
      } catch {
        toast.error('Order not found');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="text-center py-20 text-gray-500">Loading order...</div>
  );

  if (!order) return null;

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate('/orders')}
        className="text-red-500 mb-6 flex items-center gap-1 hover:underline"
      >
        ← Back to Orders
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.id}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-NG', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {order.is_paid ? '✅ Paid' : '❌ Unpaid'}
            </span>
          </div>
        </div>
      </div>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-6">Order Progress</h2>
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-red-500 transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  index <= currentStep
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <p className={`text-xs mt-2 capitalize font-medium ${
                  index <= currentStep ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-gray-800 mb-4">
            Items Ordered ({order.items.length})
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
  <div key={item.id} className="flex gap-3 items-center">
    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-red-50">
      {item.product?.image ? (
        <img
  src={getMediaUrl(item.product.image)}
  alt={item.product_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/100x100?text=Oja';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xl">
          🛍️
        </div>
      )}
    </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                  <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-red-500 text-sm">
                  ₦{Number(item.total_price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span className="text-red-500">₦{Number(order.total_price).toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4">Delivery Information</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Name:</span> {order.full_name}</p>
              <p><span className="font-medium">Email:</span> {order.email}</p>
              <p><span className="font-medium">Phone:</span> {order.phone}</p>
              <p><span className="font-medium">Address:</span> {order.address}</p>
              <p><span className="font-medium">City:</span> {order.city}</p>
              <p><span className="font-medium">State:</span> {order.state}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4">Payment Information</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className={order.is_paid ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                  {order.is_paid ? '✅ Paid' : '❌ Not Paid'}
                </span>
              </p>
              <p><span className="font-medium">Method:</span> Paystack</p>
              {order.payment_reference && (
                <p className="break-all">
                  <span className="font-medium">Reference:</span>{' '}
                  <span className="font-mono text-xs">{order.payment_reference}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <Link
          to="/products"
          className="flex-1 text-center bg-red-500 text-white rounded-lg py-3 font-semibold hover:bg-red-600 transition"
        >
          Continue Shopping →
        </Link>
        <Link
          to="/orders"
          className="flex-1 text-center border border-red-400 text-red-400 rounded-lg py-3 font-semibold hover:bg-red-50 transition"
        >
          All Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;