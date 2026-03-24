import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  Check,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const shipping = totalPrice > 100 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shipping + tax;

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-display text-3xl text-gray-800 mb-4">Your cart is empty</h1>
          <Link to="/" className="text-brand-blue hover:underline">Continue shopping</Link>
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
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrderNumber = 'VW' + Date.now().toString().slice(-8);
    setOrderNumber(newOrderNumber);
    clearCart();
    setStep('confirmation');
    setIsProcessing(false);
    window.scrollTo(0, 0);
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-white" />
          </div>
          <h1 className="font-display text-3xl text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
          <p className="text-gray-800 font-body mb-8">Order Number: <span className="text-brand-blue">{orderNumber}</span></p>
          <p className="text-gray-500 mb-8">A confirmation email has been sent to your email address.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand-blue text-white font-body font-semibold px-8 py-4 rounded-full hover:bg-brand-dark transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-brand-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Truck size={16} />
              </div>
              <span className="font-body text-sm hidden sm:block">Shipping</span>
            </div>
            <div className="w-12 h-px bg-gray-200" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-brand-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                <CreditCard size={16} />
              </div>
              <span className="font-body text-sm hidden sm:block">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-display text-xl text-gray-800 mb-6">Shipping Information</h2>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">First Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">Email *</label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-gray-500 text-sm mb-2 block">Address *</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      placeholder="Las Vegas"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      placeholder="NV"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      placeholder="89146"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-body transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-blue text-white font-body font-semibold py-4 rounded-full hover:bg-brand-dark transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h2 className="font-display text-xl text-gray-800 mb-6">Payment Information</h2>
                
                <div className="mb-6">
                  <label className="text-gray-500 text-sm mb-2 block">Card Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue pl-12"
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">CVV *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="123"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-gray-500 text-sm mb-2 block">Name on Card *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-body transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-brand-blue text-white font-body font-semibold py-4 rounded-full hover:bg-brand-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay ${finalTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-24">
              <h2 className="font-display text-xl text-gray-800 mb-6">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm truncate">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gray-700 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-500 font-body text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-body text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-body text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-gray-800 font-display text-xl">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
