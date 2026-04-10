import { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminLayout from './components/layout/AdminLayout';
import SiteLayout from './components/layout/SiteLayout';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminUserPricingPage from './pages/AdminUserPricingPage';
import AdminUsersPage from './pages/AdminUsersPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import { preloadImage } from './components/ui/StableImage';

const criticalImageSources = [
  '/images/home-hero-geek-bar-pulse-x.png',
  '/images/home-series-geek-bar-pulse-x-7x4.png',
  '/images/catalog-geek-bar-pulse-x-pear-of-thieves-4x3.png',
  '/images/catalog-geek-bar-pulse-x-raspberry-peach-lime-4x3.png',
  '/images/detail-geek-bar-pulse-x-pear-of-thieves-hero.png',
  '/images/detail-geek-bar-pulse-x-raspberry-peach-lime-hero.png',
];

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <WarmCriticalImages />
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<SiteLayout><Outlet /></SiteLayout>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="users/pricing" element={<AdminUserPricingPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function WarmCriticalImages() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let cancelled = false;
    const warm = () => {
      if (cancelled) {
        return;
      }

      criticalImageSources.forEach((src, index) => {
        void preloadImage(src, index < 4 ? 'high' : 'auto').catch(() => {
          // Let the on-screen image fallback handle any broken asset state.
        });
      });
    };

    let dispose: () => void;

    if ('requestIdleCallback' in window) {
      const idleWindow = window as Window & {
        requestIdleCallback: (callback: () => void, options?: { timeout: number }) => number;
        cancelIdleCallback: (id: number) => void;
      };
      const idleId = idleWindow.requestIdleCallback(warm, { timeout: 350 });
      dispose = () => idleWindow.cancelIdleCallback(idleId);
    } else {
      const timeoutId = setTimeout(warm, 180);
      dispose = () => clearTimeout(timeoutId);
    }

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return null;
}
