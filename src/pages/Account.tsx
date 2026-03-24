import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Edit
} from 'lucide-react';

interface UserInfo {
  name: string;
  email: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'payment'>('overview');

  // Demo orders
  const orders: Order[] = [
    { id: 'VW12345678', date: '2025-03-20', total: 45.99, status: 'Delivered', items: 2 },
    { id: 'VW12345679', date: '2025-03-15', total: 89.50, status: 'Shipped', items: 3 },
    { id: 'VW12345680', date: '2025-03-10', total: 23.75, status: 'Processing', items: 1 },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="font-display text-xl text-white mb-4">Order History</h2>
            {orders.map((order) => (
              <div key={order.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-body font-semibold">{order.id}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>{order.date}</span>
                  <span>{order.items} items</span>
                  <span className="text-white font-semibold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'addresses':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-white">Saved Addresses</h2>
              <button className="text-brand-red text-sm hover:underline flex items-center gap-1">
                <Edit size={14} />
                Add New
              </button>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-body font-semibold mb-1">Default Address</p>
                  <p className="text-white/60 text-sm">123 Main Street</p>
                  <p className="text-white/60 text-sm">Las Vegas, NV 89146</p>
                  <p className="text-white/60 text-sm">United States</p>
                </div>
                <button className="text-white/40 hover:text-white">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-white">Payment Methods</h2>
              <button className="text-brand-red text-sm hover:underline flex items-center gap-1">
                <Edit size={14} />
                Add New
              </button>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                    <span className="text-white text-xs">VISA</span>
                  </div>
                  <div>
                    <p className="text-white font-body">•••• •••• •••• 4242</p>
                    <p className="text-white/60 text-sm">Expires 12/27</p>
                  </div>
                </div>
                <span className="text-green-500 text-sm">Default</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-display text-xl">{user.name}</h2>
                  <p className="text-white/60">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-brand-red font-display text-2xl">{orders.length}</p>
                <p className="text-white/60 text-sm">Orders</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-brand-red font-display text-2xl">1</p>
                <p className="text-white/60 text-sm">Addresses</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
                <p className="text-brand-red font-display text-2xl">1</p>
                <p className="text-white/60 text-sm">Payment</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-display text-lg">Recent Orders</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-brand-red text-sm hover:underline flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={14} />
                </button>
              </div>
              {orders.slice(0, 2).map((order) => (
                <div key={order.id} className="bg-white/5 rounded-lg p-4 border border-white/10 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-body">{order.id}</span>
                    <span className="text-white/60 text-sm">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl text-white mb-8">My Account</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-brand-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <User size={18} />
                <span className="font-body">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'orders' ? 'bg-brand-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Package size={18} />
                <span className="font-body">Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'addresses' ? 'bg-brand-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <MapPin size={18} />
                <span className="font-body">Addresses</span>
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'payment' ? 'bg-brand-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CreditCard size={18} />
                <span className="font-body">Payment</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-red-500/20 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-body">Logout</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
