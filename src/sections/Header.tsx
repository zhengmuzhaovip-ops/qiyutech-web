import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Phone, LogOut, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitch from '../components/LanguageSwitch';

export default function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

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
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <span className="font-body hidden sm:block opacity-90">
              Welcome to QIYU Tech — Premium Vape Products
            </span>
            <div className="flex items-center gap-4 ml-auto">
              <LanguageSwitch />
              <Link to="#" className="hover:text-blue-100 transition-colors font-body flex items-center gap-1">
                <Phone size={13} />{t('contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`transition-all duration-500 z-50 ${isScrolled ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md' : 'relative bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img src="/images/logo.png" alt="QIYU" className="h-11 w-auto group-hover:scale-105 transition-transform" />
              <div className="hidden sm:flex flex-col">
                <span className="font-display text-xl text-gray-800 leading-tight">QIYU</span>
                <span className="text-xs text-gray-400 tracking-widest leading-tight">TECH</span>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-6 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-5 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                <button type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-md">
                  <Search size={16} className="text-white" />
                </button>
              </div>
            </form>

            {/* User actions */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-1.5">
                  {isAdmin && (
                    <Link to="/admin"
                      className="flex items-center gap-1.5 text-xs bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <LayoutDashboard size={13} />Admin
                    </Link>
                  )}
                  <Link to="/account"
                    className="flex items-center gap-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-brand-blue px-4 py-2 rounded-lg text-sm font-medium transition-all">
                    <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                      <User size={13} className="text-white" />
                    </div>
                    <span className="max-w-28 truncate">{user.name.split(' ')[0]}</span>
                  </Link>
                  <button onClick={handleLogout}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Sign out">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all border border-gray-200">
                    <User size={15} />{t('signIn')}
                  </Link>
                  <Link to="/register"
                    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20">
                    {t('createAccount')}
                  </Link>
                </div>
              )}
            </div>

            {/* Cart + Mobile toggle */}
            <div className="flex items-center gap-3 ml-3">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-blue transition-colors">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-blue text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
              <button className="lg:hidden p-2 text-gray-600 hover:text-brand-blue transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-7 h-11">
              {categories.map(cat => (
                <a key={cat.key} href={`#${cat.key}`}
                  className="text-gray-500 hover:text-blue-600 transition-colors text-xs font-semibold uppercase tracking-wider relative group">
                  {cat.label}
                  <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue" />
              </form>

              {isLoggedIn && user ? (
                <div className="flex gap-2 mb-4 pb-4 border-b border-gray-100">
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium">
                    <User size={15} />{user.name.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout}
                    className="px-4 bg-red-50 text-red-500 rounded-xl border border-red-100">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-4 pb-4 border-b border-gray-100">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium">
                    {t('signIn')}
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2.5 rounded-xl text-sm font-semibold">
                    {t('createAccount')}
                  </Link>
                </div>
              )}

              <div className="space-y-0.5">
                {categories.map(cat => (
                  <a key={cat.key} href={`#${cat.key}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center py-2.5 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium uppercase tracking-wide">
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

