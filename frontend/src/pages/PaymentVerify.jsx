import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verify = async () => {
      try {
        await api.post('/orders/verify-payment/', { reference });
        setStatus('success');
        toast.success('Payment successful! 🎉');
        setTimeout(() => navigate('/orders'), 3000);
      } catch {
        setStatus('failed');
        toast.error('Payment verification failed');
      }
    };
    if (reference) verify();
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        {status === 'verifying' && (
          <>
            <p className="text-5xl mb-4">⏳</p>
            <h2 className="text-2xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-500 mt-2">Please wait</p>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="text-5xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-500 mt-2">Redirecting to your orders...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <p className="text-5xl mb-4">❌</p>
            <h2 className="text-2xl font-bold text-red-500">Payment Failed</h2>
            <button
              onClick={() => navigate('/cart')}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Back to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;