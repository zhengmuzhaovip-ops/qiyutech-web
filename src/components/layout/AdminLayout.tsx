import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { label: '概览', to: '/admin' },
  { label: '订单', to: '/admin/orders' },
  { label: '商品', to: '/admin/products' },
  { label: '用户', to: '/admin/users' },
];

export default function AdminLayout() {
  const { isLoggedIn, user, logout } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] xl:grid-cols-[280px,1fr]">
        <aside className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(22,163,74,0.14),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-5 py-6 xl:min-h-screen xl:border-b-0 xl:border-r xl:px-6 xl:py-8">
          <div className="flex items-center justify-between gap-4 xl:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-400/80">
                QIYUTECH
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white xl:text-[2rem]">
                后台管理
              </h1>
              <p className="mt-2 max-w-[18rem] text-sm leading-6 text-neutral-400">
                统一管理批发订单、商品、用户，以及后台内部操作。
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              退出登录
            </button>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto xl:mt-10 xl:block xl:space-y-2">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `flex min-w-fit items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition xl:w-full ${
                    isActive
                      ? 'border-emerald-400/30 bg-emerald-500/10 text-white shadow-[0_0_0_1px_rgba(16,185,129,0.08)]'
                      : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 grid gap-3 xl:mt-10">
            <div className="rounded-[1.3rem] border border-white/10 bg-black/40 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">当前管理员</p>
              <p className="mt-3 text-sm font-medium text-white">{user.name}</p>
              <p className="mt-1 break-all text-sm text-neutral-400">{user.email}</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-black/40 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">工作区</p>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                这里用于处理商品结构、订单审核、贸易账户管理等后台内部事务。
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03),_transparent_32%)] px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
