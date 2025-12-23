import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Package, Wheat } from 'lucide-react';
import navbarBackground from '../assets/images/backgrounds/navbar-bg.jpg';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className="sticky top-0 z-50 shadow-lg"
      style={{
        backgroundImage: `linear-gradient(rgba(210,180,140,0.85), rgba(181,136,99,0.85)), url(${navbarBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group" 
            onClick={closeMobileMenu}
          >
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                Rehoboth Cereals & Shop
              </span>
            </div>
            <div className="sm:hidden">
              <span className="text-xl font-bold text-white tracking-wide drop-shadow-lg">
                Rehoboth Cereals & Shop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/30'
                  : 'text-amber-50 hover:bg-white/15 hover:text-white backdrop-blur-sm'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                isActive('/products')
                  ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/30'
                  : 'text-amber-50 hover:bg-white/15 hover:text-white backdrop-blur-sm'
              }`}
            >
              Products
            </Link>

            {user && (
              <>
                <Link
                  to="/orders"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    isActive('/orders')
                      ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/30'
                      : 'text-amber-50 hover:bg-white/15 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  Orders
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                      isActive('/admin')
                        ? 'bg-white/25 text-white shadow-lg backdrop-blur-sm border border-white/30'
                        : 'text-amber-50 hover:bg-white/15 hover:text-white backdrop-blur-sm'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side - Cart & Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-3 hover:bg-white/15 rounded-full transition-all duration-300 transform hover:scale-110 group backdrop-blur-sm"
            >
              <ShoppingCart className="w-6 h-6 text-amber-50 group-hover:text-white" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white/20">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-full font-medium transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-white font-medium transition-all duration-300 hover:bg-white/15 rounded-full border-2 border-white/30 backdrop-blur-sm transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white/30 backdrop-blur-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 hover:bg-white/15 rounded-full transition-all backdrop-blur-sm"
              onClick={closeMobileMenu}
            >
              <ShoppingCart className="w-6 h-6 text-amber-50" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white/20">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 hover:bg-white/15 rounded-full transition-all backdrop-blur-sm"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-amber-50" />
              ) : (
                <Menu className="w-7 h-7 text-amber-50" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-6 border-t border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`px-5 py-3 rounded-full font-medium transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-white text-amber-700 shadow-lg'
                    : 'text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className={`px-5 py-3 rounded-full font-medium transition-all duration-300 ${
                  isActive('/products')
                    ? 'bg-white text-amber-700 shadow-lg'
                    : 'text-white hover:bg-white/30 backdrop-blur-sm'
                }`}
              >
                Products
              </Link>

              {user && (
                <>
                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className={`px-5 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive('/orders')
                        ? 'bg-white text-amber-700 shadow-lg'
                        : 'text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    Orders
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className={`px-5 py-3 rounded-full font-medium transition-all duration-300 ${
                        isActive('/admin')
                          ? 'bg-white text-amber-700 shadow-lg'
                          : 'text-white hover:bg-white/30 backdrop-blur-sm'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-white/20 mt-3">
                {user ? (
                  <>
                    <div className="px-5 py-3 mb-3 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-3 border-2 border-white/30 shadow-lg">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-3 text-white hover:bg-white/30 bg-white/20 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 border-2 border-white/30 shadow-lg backdrop-blur-sm"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="px-5 py-3 text-center text-white rounded-full font-medium transition-all duration-300 border-2 border-white/30 hover:bg-white/30 backdrop-blur-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="px-5 py-3 text-center bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 shadow-lg border-2 border-white/30 backdrop-blur-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;