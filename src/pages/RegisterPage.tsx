import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const blockedEmailDomains = ['example.com', 'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com'];

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, '');
}

function isValidEmail(value: string) {
  const email = value.trim().toLowerCase();
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicPattern.test(email)) return false;
  const domain = email.split('@')[1] || '';
  return !blockedEmailDomains.includes(domain);
}

function isValidPhone(value: string) {
  const normalized = normalizePhone(value);
  return /^\+?[1-9]\d{7,14}$/.test(normalized);
}

function validateIdentifier(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Enter a business email or mobile number.';
  }

  if (trimmed.includes('@')) {
    return isValidEmail(trimmed) ? '' : 'Use a valid business email address.';
  }

  return isValidPhone(trimmed) ? '' : 'Use a valid mobile number with country code if needed.';
}

function validatePassword(value: string) {
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(value)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(value)) return 'Password must include at least one lowercase letter.';
  if (!/\d/.test(value)) return 'Password must include at least one number.';
  return '';
}

export default function RegisterPage() {
  const { isLoggedIn, login } = useAuth();
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (isLoggedIn) {
    return <Navigate to="/account" replace />;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedIdentifier = identifier.trim();

    if (trimmedName.length < 2) {
      setError('Enter a valid business contact name.');
      return;
    }

    const identifierError = validateIdentifier(trimmedIdentifier);
    if (identifierError) {
      setError(identifierError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    const isEmail = trimmedIdentifier.includes('@');
    login('demo-token', {
      id: `trade-user-${trimmedName.toLowerCase().replace(/\s+/g, '-')}`,
      name: trimmedName,
      email: isEmail ? trimmedIdentifier.toLowerCase() : '',
      phone: isEmail ? undefined : normalizePhone(trimmedIdentifier),
      role: 'customer',
    });

    setError('');
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-20">
      <div className="rounded-[1.75rem] border border-white/10 bg-neutral-950 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:rounded-[2rem] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Trade Registration</p>
        <h1 className="mt-3 max-w-[18.5rem] text-balance text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:max-w-none sm:text-3xl sm:tracking-normal">
          Create trade account
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-8 text-neutral-400 sm:leading-7">
          Register with a business email or mobile number to prepare for wholesale ordering, account review, and repeat replenishment support.
        </p>

        <form className="mt-8 space-y-5 sm:space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm text-neutral-300">
            Business contact name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-[15px] text-white outline-none placeholder:text-neutral-500"
              placeholder="Full name"
            />
          </label>

          <label className="block text-sm text-neutral-300">
            Business email or mobile number
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-[13px] text-white outline-none placeholder:text-neutral-500 sm:text-[15px]"
              placeholder="name@company.com or +1 800 555 0199"
            />
          </label>

          <label className="block text-sm text-neutral-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-[15px] text-white outline-none placeholder:text-neutral-500"
              placeholder="Minimum 8 characters"
            />
          </label>

          <label className="block text-sm text-neutral-300">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-[15px] text-white outline-none placeholder:text-neutral-500"
              placeholder="Re-enter password"
            />
          </label>

          <div className="rounded-[1.05rem] border border-white/10 bg-white/[0.03] px-3 py-2 text-[10.5px] leading-5 tracking-[-0.02em] text-neutral-400 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm sm:leading-7 sm:tracking-normal">
            Passwords should include at least 8 characters, one uppercase letter, one lowercase letter, and one number.
          </div>

          {error ? (
            <div className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-neutral-300">
              {error}
            </div>
          ) : null}

          <Button type="submit">Create account</Button>
        </form>
      </div>
    </div>
  );
}
