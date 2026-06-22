import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const itemCount = cart?.total_items || 0;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.95rem',
  };

  return (
    <nav style={{ background: '#1a1a2e' }} className="text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          style={{ color: '#e94560', fontSize: '1.4rem', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          🛍️ Ọjà-Wá
        </Link>

        {/* Search Bar - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md"
        >
          <div className="flex w-full rounded-lg overflow-hidden">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                background: '#16213e',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                flex: 1,
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#e94560',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              🔍
            </button>
          </div>
        </form>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/products" style={linkStyle}>Products</Link>

          <Link to="/cart" style={linkStyle}>
            🛒
            {itemCount > 0 && (
              <span style={{
                background: '#e94560',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.75rem',
                marginLeft: '2px',
              }}>
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/wishlist" style={linkStyle}>Wishlist</Link>
              <Link to="/orders" style={linkStyle}>Orders</Link>
              <Link to="/profile" style={linkStyle}>Profile</Link>
              <button
                onClick={handleLogout}
                style={{
                  background: '#e94560',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Login</Link>
              <Link
                to="/register"
                style={{
                  background: '#e94560',
                  color: 'white',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <span style={{
            display: 'block', width: '24px', height: '2px',
            background: 'white', transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px',
            background: 'white', transition: 'all 0.3s',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px',
            background: 'white', transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none',
          }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{ background: '#16213e', borderTop: '1px solid #2d2d4e' }}
          className="md:hidden px-4 py-4 flex flex-col gap-4"
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{
                background: '#1a1a2e',
                border: 'none',
                color: 'white',
                padding: '0.6rem 1rem',
                flex: 1,
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#e94560',
                border: 'none',
                color: 'white',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
              }}
            >
              🔍
            </button>
          </form>

          <Link to="/products" onClick={closeMenu} style={linkStyle}> Products</Link>
          <Link to="/cart" onClick={closeMenu} style={linkStyle}>
             Cart {itemCount > 0 && (
              <span style={{
                background: '#e94560',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.75rem',
                marginLeft: '4px',
              }}>
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/wishlist" onClick={closeMenu} style={linkStyle}> Wishlist</Link>
              <Link to="/orders" onClick={closeMenu} style={linkStyle}> Orders</Link>
              <Link to="/profile" onClick={closeMenu} style={linkStyle}> Profile</Link>
              <button
                onClick={handleLogout}
                style={{
                  background: '#e94560',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  fontSize: '0.95rem',
                }}
              >
                 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} style={linkStyle}> Login</Link>
              <Link
                to="/register"
                onClick={closeMenu}
                style={{
                  background: '#e94560',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                }}
              >
                ✨ Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;