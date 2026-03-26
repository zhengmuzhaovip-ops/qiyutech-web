import { useState, useEffect } from 'react';
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: string;
  monthRevenue: string;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  lowStockProducts: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: { firstName: string; lastName: string; email: string };
  pricing: { total: number };
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface DailyOrder {
  _id: string;
  count: number;
  revenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [dailyOrders, setDailyOrders] = useState<DailyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setRecentUsers(data.recentUsers || []);
        setDailyOrders(data.dailyOrders || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 库存不足预警 */}
      {(stats?.lowStockProducts ?? 0) > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-orange-500 shrink-0" size={20} />
          <p className="text-orange-700 text-sm">
            <strong>{stats?.lowStockProducts}</strong> product(s) have low stock (≤10 units). 
            <a href="/admin/products" className="underline ml-1">View Products →</a>
          </p>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-display text-gray-800 mt-1">{stats?.totalUsers ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-4">Registered customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-display text-gray-800 mt-1">{stats?.totalOrders ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-4">{stats?.pendingOrders ?? 0} pending</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-display text-gray-800 mt-1">${stats?.totalRevenue ?? '0.00'}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-green-500 text-xs">
            <TrendingUp size={14} />
            <span>This month: ${stats?.monthRevenue ?? '0.00'}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-display text-gray-800 mt-1">{stats?.totalProducts ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Package className="text-yellow-600" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-4">
            {(stats?.lowStockProducts ?? 0) > 0
              ? `${stats?.lowStockProducts} low stock`
              : 'All stocked up'}
          </p>
        </div>
      </div>

      {/* 订单状态分布 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-display text-lg text-gray-800 mb-4">Order Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Pending',    value: stats?.pendingOrders,    color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Processing', value: stats?.processingOrders, color: 'bg-blue-50 text-blue-600' },
            { label: 'Shipped',    value: stats?.shippedOrders,    color: 'bg-purple-50 text-purple-600' },
            { label: 'Delivered',  value: stats?.deliveredOrders,  color: 'bg-green-50 text-green-600' },
            { label: 'Cancelled',  value: stats?.cancelledOrders,  color: 'bg-red-50 text-red-600' },
          ].map((item) => (
            <div key={item.label} className={`text-center p-4 rounded-lg ${item.color}`}>
              <p className="text-2xl font-display">{item.value ?? 0}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 近7天趋势 */}
      {dailyOrders.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-display text-lg text-gray-800 mb-4">Last 7 Days Orders</h3>
          <div className="flex items-end gap-2 h-24">
            {dailyOrders.map((day) => {
              const maxCount = Math.max(...dailyOrders.map(d => d.count), 1);
              const height = Math.max((day.count / maxCount) * 100, 8);
              return (
                <div key={day._id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">{day.count}</span>
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                    title={`${day._id}: ${day.count} orders`}
                  />
                  <span className="text-xs text-gray-400">{day._id.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 最近订单 & 最近用户 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-display text-lg text-gray-800">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-gray-400 text-sm text-center">No orders yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-semibold text-gray-800 text-sm">${order.pricing.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-display text-lg text-gray-800">Recent Users</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length === 0 ? (
              <p className="p-6 text-gray-400 text-sm text-center">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user._id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
