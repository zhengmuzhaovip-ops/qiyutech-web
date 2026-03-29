import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { siteSettings } from '../data/site';

export default function AccountPage() {
  const { user, isLoggedIn, logout } = useAuth();

  if (!isLoggedIn || !user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-neutral-950 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Account</h1>
          <p className="mt-4 text-neutral-400">Login or register to manage orders and speed up checkout.</p>
          <div className="mt-6 flex justify-center gap-3">
            <ButtonLink to="/login">Login</ButtonLink>
            <ButtonLink to="/register" variant="secondary">Register</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid gap-6 md:grid-cols-[1fr,320px]">
        <section className="rounded-[2rem] border border-white/10 bg-neutral-950 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Buyer account</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back, {user.name}.</h1>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-neutral-500">Email</p>
              <p className="mt-2 text-white">{user.email}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-neutral-500">Support</p>
              <p className="mt-2 text-white">{siteSettings.phone}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-white/30">
              Continue shopping
            </Link>
            <button onClick={logout} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:border-white/30">
              Logout
            </button>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Contact sales</p>
          <div className="mt-4 space-y-3 text-sm text-neutral-300">
            <p>{siteSettings.phone}</p>
            <p>{siteSettings.email}</p>
            <a href={siteSettings.whatsappUrl} target="_blank" rel="noreferrer" className="block hover:text-white">
              WhatsApp support
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
