import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone_number: user?.phone_number || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/auth/profile/', formData);
      toast.success('Profile updated! ✅');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile 👤</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow p-6 text-center h-fit">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            👤
          </div>
          <p className="font-bold text-gray-800">{user?.username}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="mt-4 space-y-2">
            <Link
              to="/orders"
              className="block w-full text-center border border-red-400 text-red-400 rounded-lg py-2 text-sm hover:bg-red-50 transition"
            >
              📦 My Orders
            </Link>
            <Link
              to="/wishlist"
              className="block w-full text-center border border-red-400 text-red-400 rounded-lg py-2 text-sm hover:bg-red-50 transition"
            >
              ❤️ My Wishlist
            </Link>
            <Link
              to="/cart"
              className="block w-full text-center border border-gray-300 text-gray-600 rounded-lg py-2 text-sm hover:bg-gray-50 transition"
            >
              🛒 My Cart
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="08012345678"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white rounded-lg py-3 font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;