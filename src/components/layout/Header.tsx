import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { siteSettings } from '../../data/site';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Catalog', to: '/products' },
  { label: 'Order Review', to: '/cart' },
  { label: 'Trade Account', to: '/account' },
];

export default function Header() {
  const { totalItems } = useCart();
  const { user, isLoggedIn } = useAuth();
  const hasCartItems = totalItems > 0;
  const headerNavItems =
    user?.role === 'admin' ? [...navItems, { label: 'Admin', to: '/admin' }] : navItems;

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-black/88 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:px-5 lg:px-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,211,159,0.08),transparent_32%),radial-gradient(circle_at_top_right,rgba(74,141,255,0.07),transparent_28%)] opacity-80" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(56,211,159,0.8),rgba(74,141,255,0.8),transparent)] opacity-80" />

          <div className="relative flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            <Link
              to="/"
              className="flex min-w-0 items-center gap-2 text-white transition hover:opacity-95 sm:gap-3"
            >
              <img
                src="/images/logo-new-4-8.png"
                alt={`${siteSettings.brandName} logo`}
                className="h-8 w-8 shrink-0 object-contain drop-shadow-[0_0_16px_rgba(72,168,255,0.18)] sm:h-11 sm:w-11"
              />
              <div className="min-w-0">
                <span className="block min-w-0 text-[16px] font-semibold uppercase tracking-[0.12em] text-white sm:text-lg sm:tracking-[0.2em]">
                  {siteSettings.brandName}
                </span>
                <span className="mt-1 hidden text-[10px] uppercase tracking-[0.24em] text-[#38d39f] lg:block">
                  Wholesale Storefront
                </span>
              </div>
            </Link>

            <nav className="hidden min-w-0 items-center gap-1 rounded-full border border-white/10 bg-black/28 p-1 md:flex">
              {headerNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                      isActive
                        ? 'bg-white text-black shadow-[0_8px_20px_rgba(255,255,255,0.12)]'
                        : 'text-neutral-400 hover:bg-white/[0.05] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span className="inline-flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.to === '/account' ? (
                        <AccountStatusDot isLoggedIn={isLoggedIn} isActive={isActive} />
                      ) : null}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 text-sm sm:gap-3">
              <a
                href={`tel:${siteSettings.phoneUs.replace(/[^\d+]/g, '')}`}
                className="hidden rounded-full border border-white/10 bg-black/28 px-4 py-2.5 text-[13px] text-neutral-300 transition hover:border-white/20 hover:text-white xl:inline-flex"
              >
                Phone (USA): {siteSettings.phoneUs}
              </a>
              <Link
                to="/cart"
                className={`inline-flex min-w-[126px] shrink-0 items-center justify-between gap-2 rounded-full border px-3.5 py-2 text-[12px] font-medium text-white transition hover:-translate-y-0.5 sm:min-w-0 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                  hasCartItems
                    ? 'border-emerald-400/25 bg-emerald-400/[0.06] shadow-[0_0_22px_rgba(52,211,153,0.08)] hover:border-emerald-300/45 hover:bg-white hover:text-black'
                    : 'border-white/12 bg-white/[0.04] hover:border-white/30 hover:bg-white hover:text-black'
                }`}
              >
                <span className="whitespace-nowrap tracking-[0.01em]">Order Review</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] sm:px-2 sm:text-xs ${
                    hasCartItems
                      ? 'border border-emerald-300/25 bg-emerald-400/15 text-emerald-100 shadow-[0_0_10px_rgba(52,211,153,0.18)]'
                      : 'border border-current/15'
                  }`}
                >
                  {totalItems}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-t border-white/5 md:hidden">
        <nav className="mx-auto flex max-w-full gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {headerNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full border px-3 py-2 text-sm transition ${
                  isActive
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <span className="inline-flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.to === '/account' ? (
                    <AccountStatusDot isLoggedIn={isLoggedIn} isActive={isActive} />
                  ) : null}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function AccountStatusDot({
  isLoggedIn,
  isActive,
}: {
  isLoggedIn: boolean;
  isActive: boolean;
}) {
  const toneClass = isLoggedIn
    ? isActive
      ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.55)]'
      : 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]'
    : isActive
      ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
      : 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.4)]';

  return <span className={`h-2.5 w-2.5 rounded-full border border-white/20 ${toneClass}`} />;
}
