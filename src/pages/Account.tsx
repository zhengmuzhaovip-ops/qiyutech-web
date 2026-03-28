import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  pricing: { total: number };
  status: string;
  items: { quantity: number }[];
}

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', phone: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUser();
    fetchOrders();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone || '',
        });
      } else {
        // token 失效，跳转登录
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/my-orders?limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {
      // silent fail
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaveError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          name: `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
          role: data.user.role,
        }));
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.message || 'Update failed');
      }
    } catch {
      setSaveError('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalItemsCount = (order: Order) =>
    order.items.reduce((sum, item) => sum + item.quantity, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div>
            <h2 className="font-display text-xl text-gray-800 mb-6">Order History</h2>
            {isLoadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-800 font-body font-semibold">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-body capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>{totalItemsCount(order)} items</span>
                      <span className="text-gray-800 font-semibold">${order.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-gray-800">Profile Settings</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-brand-blue hover:underline text-sm"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 bg-brand-blue text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    <Check size={14} />
                    Save
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setSaveError(''); }}
                    className="flex items-center gap-1 bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-sm"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {saveSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 rounded-lg px-4 py-3 text-sm">
                Profile updated successfully!
              </div>
            )}
            {saveError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
                {saveError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-500 text-sm mb-1 block">First Name</label>
                  {isEditing ? (
                    <input
                      value={editData.firstName}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-brand-blue"
                    />
                  ) : (
                    <p className="text-gray-800 font-body py-2.5">{user.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="text-gray-500 text-sm mb-1 block">Last Name</label>
                  {isEditing ? (
                    <input
                      value={editData.lastName}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-brand-blue"
                    />
                  ) : (
                    <p className="text-gray-800 font-body py-2.5">{user.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">Email</label>
                <p className="text-gray-800 font-body py-2.5">{user.email}</p>
                <p className="text-gray-400 text-xs">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">Phone</label>
                {isEditing ? (
                  <input
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:border-brand-blue"
                    placeholder="+1 (555) 000-0000"
                  />
                ) : (
                  <p className="text-gray-800 font-body py-2.5">{user.phone || '—'}</p>
                )}
              </div>

              <div>
                <label className="text-gray-500 text-sm mb-1 block">Address</label>
                <p className="text-gray-800 font-body py-2.5">
                  {user.address?.street
                    ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}`
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-gray-800 font-display text-xl">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-brand-blue text-white px-2 py-0.5 rounded-full mt-1 inline-block">
                      Administrator
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-brand-blue font-display text-2xl">{orders.length}</p>
                <p className="text-gray-500 text-sm">Total Orders</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-brand-blue font-display text-2xl">
                  ${orders.reduce((sum, o) => sum + o.pricing.total, 0).toFixed(0)}
                </p>
                <p className="text-gray-500 text-sm">Total Spent</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-display text-lg">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-brand-blue text-sm hover:underline flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={14} />
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm">No orders yet</p>
              ) : (
                orders.slice(0, 3).map((order) => (
                  <div key={order._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-body text-sm">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-gray-800 font-semibold text-sm">${order.pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl text-gray-800 mb-8">My Account</h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              {[
                { key: 'overview', icon: User, label: 'Overview' },
                { key: 'orders', icon: Package, label: 'Orders' },
                { key: 'profile', icon: MapPin, label: 'Profile' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors border-b border-gray-50 last:border-0 ${
                    activeTab === key
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-body">{label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-body">Logout</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

