import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center text-center px-4">
    <div>
      <p className="text-8xl mb-4">🔍</p>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-600 transition"
      >
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;