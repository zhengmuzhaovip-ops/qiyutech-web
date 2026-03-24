import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import LanguageSwitch from '../components/LanguageSwitch';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const categories = [
    { key: 'disposables', label: t('disposables') },
    { key: 'eLiquids', label: t('eLiquids') },
    { key: 'new', label: t('new') },
    { key: 'clearance', label: t('clearance') },
    { key: 'vapeKits', label: t('vapeKits') },
    { key: 'accessories', label: t('accessories') },
    { key: 'rebuildables', label: t('rebuildables') },
    { key: 'alternatives', label: t('alternatives') },
    { key: 'nicPouches', label: t('nicPouches') },
    { key: 'brands', label: t('brands') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <span className="font-body hidden sm:block opacity-90">
              Welcome to QIYU Tech - Premium Vape Products
            </span>
            <div className="flex items-center gap-4 ml-auto">
              <LanguageSwitch />
              <Link 
                to="#" 
                className="hover:text-blue-100 transition-colors font-body flex items-center gap-1"
              >
                <Phone size={14} />
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`transition-all duration-500 z-50 ${
          isScrolled
            ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg'
            : 'relative bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Brand Name */}
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo Image */}
              <img 
                src="/images/logo.png" 
                alt="QIYU" 
                className="h-12 w-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              {/* Brand Name */}
              <div className="hidden sm:flex flex-col">
                <span className="font-display text-2xl text-gray-800">
                  QIYU
                </span>
                <span className="text-xs text-gray-500 tracking-widest -mt-1">TECH</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-6 pr-12 text-gray-800 placeholder:text-gray-400 font-body focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30">
                  <Search size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Login/Register Buttons */}
            <div className="hidden md:flex items-center gap-3 mr-4">
              {user ? (
                <Link 
                  to="/account" 
                  className="flex items-center gap-2 bg-gray-100 hover:bg-blue-500 text-gray-700 hover:text-white px-5 py-2.5 rounded-full font-body font-semibold transition-all duration-300"
                >
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-body font-semibold transition-all duration-300"
                  >
                    <User size={18} />
                    <span>{t('signIn')}</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2.5 rounded-full font-body font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30"
                  >
                    <span>{t('createAccount')}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="md:hidden text-gray-700 hover:text-blue-500 transition-colors">
                <Search size={24} />
              </button>
              <Link 
                to="/cart" 
                className="relative text-gray-700 hover:text-blue-500 transition-colors"
                title={t('myCart')}
              >
                <ShoppingCart size={24} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                className="lg:hidden text-gray-700 hover:text-blue-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-8 h-12">
              {categories.map((category) => (
                <a
                  key={category.key}
                  href={`#${category.key}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors font-body text-sm font-medium uppercase tracking-wide relative group"
                >
                  {category.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {!user && (
                <div className="flex gap-3 pb-4 border-b border-gray-100">
                  <Link 
                    to="/login" 
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-body font-semibold text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('signIn')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-body font-semibold text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('createAccount')}
                  </Link>
                </div>
              )}
              {categories.map((category) => (
                <a
                  key={category.key}
                  href={`#${category.key}`}
                  className="block py-3 text-gray-600 hover:text-blue-600 transition-colors font-body text-sm font-medium uppercase border-b border-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
