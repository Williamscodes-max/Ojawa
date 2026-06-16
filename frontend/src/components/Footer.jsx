import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ background: '#1a1a2e' }} className="text-white mt-16">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold text-red-400 mb-3">🛍️ Ọjà-Wá</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Nigeria's favourite online marketplace. Shop authentic products from local sellers delivered to your doorstep.
          </p>
          <div className="flex gap-3 mt-4">
            {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm hover:bg-red-500 transition"
                style={{ background: '#16213e' }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: 'Cart', to: '/cart' },
              { label: 'My Orders', to: '/orders' },
              { label: 'Wishlist', to: '/wishlist' },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-gray-400 hover:text-red-400 transition text-sm"
                  style={{ textDecoration: 'none' }}
                >
                  → {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            {[
              { label: 'Fashion', slug: 'fashion' },
              { label: 'Food & Drinks', slug: 'food-drinks' },
              { label: 'Beauty', slug: 'beauty' },
              { label: 'Electronics', slug: 'electronics' },
              { label: 'Art & Crafts', slug: 'art-crafts' },
            ].map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="text-gray-400 hover:text-red-400 transition text-sm"
                  style={{ textDecoration: 'none' }}
                >
                  → {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span>📍</span>
              <span>Lagos, Nigeria</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📞</span>
              <span>+234 801 234 5678</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📧</span>
              <span>support@ojawa.com</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🕐</span>
              <span>Mon - Sat: 8am - 8pm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div
        style={{ background: '#16213e' }}
        className="py-4 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            Secure payments powered by
            <span className="text-red-400 font-bold ml-1">Paystack</span>
          </p>
          <div className="flex gap-2 items-center">
            {['💳 Visa', '💳 Mastercard', '🏦 Bank Transfer', '📱 USSD'].map((method) => (
              <span
                key={method}
                className="text-xs text-gray-400 px-2 py-1 rounded"
                style={{ background: '#1a1a2e' }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{ borderTop: '1px solid #2d2d4e' }}
        className="py-4 px-4 text-center"
      >
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Ọjà-Wá. Made with ❤️ in Nigeria 🇳🇬
        </p>
      </div>
    </footer>
  );
};

export default Footer;