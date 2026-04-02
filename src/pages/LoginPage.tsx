import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    return 'Enter your business email or mobile number.';
  }

  if (trimmed.includes('@')) {
    return isValidEmail(trimmed) ? '' : 'Enter a valid business email address.';
  }

  return isValidPhone(trimmed) ? '' : 'Enter a valid mobile number with country code if needed.';
}

function validatePassword(value: string) {
  if (!value) return 'Enter your password.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: string } | null)?.from || '/account';
  const fromCheckout = from === '/checkout';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const identifierType = useMemo(() => {
    const trimmed = identifier.trim();
    if (!trimmed) return 'unknown';
    return trimmed.includes('@') ? 'email' : 'phone';
  }, [identifier]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const identifierError = validateIdentifier(identifier);
    const passwordError = validatePassword(password);
    const nextError = identifierError || passwordError;

    if (nextError) {
      setError(nextError);
      return;
    }

    const trimmed = identifier.trim();
    login('demo-token', {
      id: `trade-user-${identifierType}`,
      name: 'Trade Contact',
      email: identifierType === 'email' ? trimmed.toLowerCase() : '',
      phone: identifierType === 'phone' ? normalizePhone(trimmed) : undefined,
      role: 'customer',
    });

    setError('');
    navigate(from, { replace: true });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        padding: '24px 16px 48px',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          background: '#111',
          border: '1px solid #222',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 24px 80px rgba(0,0,0,0.32)',
        }}
      >
        <p
          style={{
            color: '#8a8a8a',
            letterSpacing: 2,
            fontSize: 12,
            marginBottom: 14,
          }}
        >
          TRADE LOGIN
        </p>

        {fromCheckout ? (
          <div
            style={{
              marginBottom: 18,
              borderRadius: 16,
              border: '1px solid #1f1f1f',
              background: '#0a0a0a',
              padding: 16,
              color: '#b8b8b8',
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Checkout requires account login first. After sign-in, you will be returned to the secure checkout page automatically.
          </div>
        ) : null}

        <h1
          style={{
            marginTop: 0,
            marginBottom: 10,
            fontSize: 28,
            lineHeight: 1.15,
            maxWidth: 240,
          }}
        >
          Access trade account
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: 24,
            color: '#9a9a9a',
            lineHeight: 1.75,
            fontSize: 14,
          }}
        >
          Use your business email or mobile number to continue to wholesale ordering.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              marginBottom: 8,
              color: '#d4d4d4',
            }}
          >
            Business email or mobile number
          </label>
          <input
            type="text"
            inputMode="email"
            autoComplete="username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="name@company.com or +1 800 555 0199"
            style={{
              width: '100%',
              height: 46,
              borderRadius: 14,
              border: '1px solid #222',
              background: '#0a0a0a',
              color: '#fff',
              padding: '0 14px',
              marginBottom: 20,
              outline: 'none',
              fontSize: 13,
            }}
          />

          <label
            style={{
              display: 'block',
              marginBottom: 8,
              color: '#d4d4d4',
            }}
          >
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            style={{
              width: '100%',
              height: 46,
              borderRadius: 14,
              border: '1px solid #222',
              background: '#0a0a0a',
              color: '#fff',
              padding: '0 14px',
              marginBottom: error ? 12 : 22,
              outline: 'none',
              fontSize: 13,
            }}
          />

          {error ? (
            <div
              style={{
                marginBottom: 18,
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                background: '#0c0c0c',
                padding: '12px 14px',
                color: '#d7d7d7',
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {error}
            </div>
          ) : null}

          <Button type="submit">Login</Button>
        </form>

        <p style={{ marginTop: 18, color: '#8a8a8a', fontSize: 14, lineHeight: 1.7 }}>
          Need a trade account?{' '}
          <Link to="/register" style={{ color: '#fff', textDecoration: 'underline' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
