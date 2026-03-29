import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isLoggedIn) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="rounded-[2rem] border border-white/10 bg-neutral-950 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Login</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Account access</h1>
        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            login('demo-token', { id: 'demo-user', name: 'Demo Buyer', email, role: 'customer' });
          }}
        >
          <label className="block text-sm text-neutral-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="block text-sm text-neutral-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            />
          </label>
          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
}
