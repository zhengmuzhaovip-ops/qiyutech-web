import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { siteSettings } from '../../data/site';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Catalog', to: '/products' },
  { label: 'Order Review', to: '/cart' },
  { label: 'Trade Account', to: '/account' },
];

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-[0.2em] text-white uppercase">
          {siteSettings.brandName}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm transition ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <a href={`tel:${siteSettings.phone}`} className="hidden text-neutral-400 hover:text-white sm:block">
            {siteSettings.phone}
          </a>
          <Link to="/cart" className="rounded-full border border-white/10 px-4 py-2 text-white hover:border-white/30">
            Order Review ({totalItems})
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 md:hidden overflow-hidden">
        <nav className="mx-auto flex max-w-full gap-2 overflow-x-auto px-3 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
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
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
