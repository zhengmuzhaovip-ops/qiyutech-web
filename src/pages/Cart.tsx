import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Truck,
  Shield,
  Package,
  LogIn,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const token = localStorage.getItem('token');
  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  // 登录用户：把本地购物车同步到后端
  useEffect(() => {
    if (!token || items.length === 0) return;
    const syncCart = async () => {
      try {
        for (const item of items) {
          await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
          });
        }
      } catch {
        // silent fail，本地购物车仍然可用
      }
    };
    syncCart();
  }, [token]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-200 mb-6" />
            <h1 className="font-display text-3xl text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-brand-blue text-white font-body font-semibold px-8 py-4 rounded-full hover:bg-brand-dark transition-colors"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl text-gray-800 mb-8">
          Shopping Cart <span className="text-gray-400 text-2xl">({totalItems} items)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 flex gap-4 shadow-sm"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-gray-800 font-body font-semibold mb-1 line-clamp-2 hover:text-brand-blue transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-brand-blue font-display text-xl mb-4">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-gray-800 font-body w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-gray-800 font-display text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-gray-400 hover:text-red-500 font-body text-sm flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="font-display text-xl text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500 font-body">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-body">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-500 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 font-body">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              {totalPrice <= 100 && (
                <div className="bg-blue-50 rounded-lg px-4 py-2 mb-4 text-xs text-brand-blue text-center">
                  Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-gray-800 font-display text-xl">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {token ? (
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-brand-blue text-white font-body font-semibold py-4 rounded-full hover:bg-brand-dark transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              ) : (
                <div className="space-y-3 mb-4">
                  <Link
                    to="/login"
                    className="w-full bg-brand-blue text-white font-body font-semibold py-4 rounded-full hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} />
                    Sign in to Checkout
                  </Link>
                  <p className="text-center text-gray-400 text-xs">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-brand-blue hover:underline">Create one</Link>
                  </p>
                </div>
              )}

              <Link
                to="/products"
                className="w-full block text-center text-gray-500 hover:text-gray-700 font-body transition-colors text-sm"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Truck className="mx-auto text-brand-blue mb-1" size={20} />
                  <span className="text-gray-400 text-xs">Free Shipping</span>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto text-brand-blue mb-1" size={20} />
                  <span className="text-gray-400 text-xs">Secure</span>
                </div>
                <div className="text-center">
                  <Package className="mx-auto text-brand-blue mb-1" size={20} />
                  <span className="text-gray-400 text-xs">30-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
