import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as { from?: string } | null)?.from || '/account';
  const fromCheckout = from === '/checkout';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    login('demo-token', {
      id: 'demo-user',
      name: 'Demo Buyer',
      email,
      role: 'customer',
    });

    navigate(from, { replace: true });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        padding: '80px 40px',
      }}
    >
      <div
        style={{
          maxWidth: 460,
          margin: '0 auto',
          background: '#111',
          border: '1px solid #222',
          borderRadius: 24,
          padding: 28,
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
          LOGIN
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
            Checkout requires login first. After sign-in, you will be sent back to the secure
            checkout page automatically.
          </div>
        ) : null}

        <h1
          style={{
            marginTop: 0,
            marginBottom: 24,
            fontSize: 30,
          }}
        >
          Account access
        </h1>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              marginBottom: 8,
              color: '#d4d4d4',
            }}
          >
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 14,
              border: '1px solid #222',
              background: '#0a0a0a',
              color: '#fff',
              padding: '0 14px',
              marginBottom: 20,
              outline: 'none',
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 14,
              border: '1px solid #222',
              background: '#0a0a0a',
              color: '#fff',
              padding: '0 14px',
              marginBottom: 22,
              outline: 'none',
            }}
          />

          <Button type="submit">Login</Button>
        </form>

        <p style={{ marginTop: 18, color: '#8a8a8a', fontSize: 14 }}>
          No account yet?{' '}
          <Link to="/register" style={{ color: '#fff', textDecoration: 'underline' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
