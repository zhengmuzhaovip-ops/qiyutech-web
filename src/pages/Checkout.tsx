import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, CreditCard, Truck, Check,
  Lock, ShieldCheck, AlertCircle, Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

interface ShippingInfo {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; state: string; zipCode: string; country: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { token, user, isLoggedIn } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', zipCode: '', country: 'US',
  });

  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = +(totalPrice * 0.08).toFixed(2);
  const finalTotal = +(totalPrice + shipping + tax).toFixed(2);

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn]);

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-200 mb-4" />
          <h2 className="font-display text-xl text-gray-700 mb-2">Your cart is empty</h2>
          <Link to="/products" className="text-brand-blue text-sm hover:underline">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item.id, name: item.name,
            price: item.price, quantity: item.quantity, image: item.image,
          })),
          shippingInfo,
          paymentInfo: { method: 'card', cardLast4: '4242' },
          pricing: { subtotal: totalPrice, shipping, tax, total: finalTotal },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.order.orderNumber);
        clearCart();
        setStep('confirmation');
        window.scrollTo(0, 0);
      } else {
        setError(data.message || 'Order failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Order confirmed page
  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" />
          </div>
          <h1 className="font-display text-2xl text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-4">Thank you for your purchase.</p>
          <div className="bg-gray-50 rounded-xl px-6 py-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">Order Number</p>
            <p className="font-display text-lg text-brand-blue">{orderNumber}</p>
          </div>
          <p className="text-gray-400 text-sm mb-8">
            A confirmation email has been sent. You can track your order in your account.
          </p>
          <div className="flex gap-3">
            <Link to="/account"
              className="flex-1 bg-brand-blue text-white text-sm font-semibold py-3 rounded-xl hover:bg-brand-dark transition-colors text-center">
              View My Orders
            </Link>
            <Link to="/products"
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:border-brand-blue hover:text-brand-blue transition-colors text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Progress indicator
  const Progress = () => (
    <div className="flex items-center justify-center mb-8">
      <div className={`flex items-center gap-2 text-sm font-medium ${step === 'shipping' ? 'text-brand-blue' : 'text-green-500'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${step === 'shipping' ? 'bg-brand-blue' : 'bg-green-500'}`}>
          {step === 'payment' ? <Check size={14} /> : '1'}
        </div>
        Shipping
      </div>
      <div className={`w-16 h-px mx-3 ${step === 'payment' ? 'bg-brand-blue' : 'bg-gray-200'}`} />
      <div className={`flex items-center gap-2 text-sm font-medium ${step === 'payment' ? 'text-brand-blue' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step === 'payment' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
        Payment
      </div>
    </div>
  );

  // Order summary sidebar
  const OrderSummary = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
      <h3 className="font-display text-lg text-gray-800 mb-5">Order Summary</h3>
      <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center p-1 border border-gray-100">
                <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 text-sm truncate">{item.name}</p>
              <p className="text-gray-400 text-xs">${item.price.toFixed(2)} each</p>
            </div>
            <p className="text-gray-800 text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 mt-3 flex justify-between text-gray-800 font-display text-lg">
        <span>Total</span><span>${finalTotal.toFixed(2)}</span>
      </div>
      {totalPrice <= 100 && (
        <p className="text-xs text-center text-gray-400 mt-3 bg-blue-50 rounded-lg py-2">
          Add <span className="text-brand-blue font-medium">${(100 - totalPrice).toFixed(2)}</span> more for free shipping
        </p>
      )}

      <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
        <div><ShieldCheck size={16} className="mx-auto text-green-500 mb-1" />SSL Secure</div>
        <div><Truck size={16} className="mx-auto text-brand-blue mb-1" />Fast Ship</div>
        <div><Package size={16} className="mx-auto text-brand-blue mb-1" />30-Day Return</div>
      </div>
    </div>
  );

  // Input style
  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="QIYU" className="h-9 w-auto" />
            <span className="font-display text-xl text-gray-800">QIYU TECH</span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock size={12} className="text-green-500" />
            Secure Checkout
          </div>
        </div>

        <Progress />

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm max-w-2xl mx-auto">
            <AlertCircle size={16} className="flex-shrink-0" />{error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                  <h2 className="font-display text-lg text-gray-800 mb-5 flex items-center gap-2">
                    <Truck size={18} className="text-brand-blue" />Shipping Address
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelCls}>First Name *</label>
                      <input type="text" required value={shippingInfo.firstName}
                        onChange={e => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className={inputCls} placeholder="John" />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name *</label>
                      <input type="text" required value={shippingInfo.lastName}
                        onChange={e => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className={inputCls} placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input type="email" required value={shippingInfo.email}
                        onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className={inputCls} placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone *</label>
                      <input type="tel" required value={shippingInfo.phone}
                        onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className={inputCls} placeholder="(555) 000-0000" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={labelCls}>Street Address *</label>
                    <input type="text" required value={shippingInfo.address}
                      onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className={inputCls} placeholder="123 Main Street" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>City *</label>
                      <input type="text" required value={shippingInfo.city}
                        onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className={inputCls} placeholder="Las Vegas" />
                    </div>
                    <div>
                      <label className={labelCls}>State *</label>
                      <input type="text" required value={shippingInfo.state}
                        onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className={inputCls} placeholder="NV" />
                    </div>
                    <div>
                      <label className={labelCls}>ZIP Code *</label>
                      <input type="text" required value={shippingInfo.zipCode}
                        onChange={e => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                        className={inputCls} placeholder="89146" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link to="/cart" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <ChevronLeft size={16} />Return to cart
                  </Link>
                  <button type="submit"
                    className="bg-brand-blue text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-dark transition-colors">
                    Continue to Payment →
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit}>
                {/* Shipping summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Shipping to</p>
                    <p className="text-sm text-gray-700 font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p className="text-sm text-gray-500">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  </div>
                  <button type="button" onClick={() => setStep('shipping')} className="text-xs text-brand-blue hover:underline">Change</button>
                </div>

                {/* Payment form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                  <h2 className="font-display text-lg text-gray-800 mb-1 flex items-center gap-2">
                    <CreditCard size={18} className="text-brand-blue" />Payment
                  </h2>
                  <p className="text-xs text-gray-400 mb-5 flex items-center gap-1">
                    <Lock size={11} className="text-green-500" />All transactions are secure and encrypted
                  </p>

                  {/* Card icons */}
                  <div className="flex items-center gap-2 mb-5">
                    {['VISA', 'MC', 'AMEX', 'DISC'].map(c => (
                      <div key={c} className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-500 font-medium bg-gray-50">{c}</div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className={labelCls}>Card Number</label>
                    <div className="relative">
                      <input type="text" required placeholder="1234 5678 9012 3456" maxLength={19}
                        className={`${inputCls} pl-12`} />
                      <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={labelCls}>Expiry Date</label>
                      <input type="text" required placeholder="MM / YY" maxLength={7} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Security Code (CVV)</label>
                      <div className="relative">
                        <input type="text" required placeholder="•••" maxLength={4} className={`${inputCls} pr-10`} />
                        <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Name on Card</label>
                    <input type="text" required placeholder="John Doe" className={inputCls} />
                  </div>
                </div>

                {/* Age verification */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-sm text-amber-700">
                  <p className="font-medium mb-1">⚠️ Age Verification</p>
                  <p className="text-xs text-amber-600">By placing this order, you confirm that you are 21 years of age or older. This product contains nicotine.</p>
                </div>

                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setStep('shipping')}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    <ChevronLeft size={16} />Back to shipping
                  </button>
                  <button type="submit" disabled={isProcessing}
                    className="bg-brand-blue text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60 flex items-center gap-2">
                    {isProcessing ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                    ) : (
                      <><Lock size={14} />Pay ${finalTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
