
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Welcome from './Welcome';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email.trim(), password);

      if (!user || typeof user !== 'object') {
        throw new Error(
          'Login response is missing user information. Please check AuthContext.jsx.'
        );
      }

      if (user.role === 'admin' || user.is_admin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);

      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 422 || status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (status === 429) {
        setError(
          'Too many login attempts. Please wait a moment before trying again.'
        );
      } else if (!err.response) {
        setError(
          'Cannot connect to the server. Please check that your Laravel backend is running.'
        );
      } else {
        setError(
          serverMessage || 'Login failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Background Welcome page */}
      <div
        style={{
          pointerEvents: 'none',
          filter: 'blur(2px)',
          opacity: 0.6,
        }}
      >
        <Welcome />
      </div>

      {/* Login modal */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          padding: '16px',
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '420px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            padding: '28px 24px',
            textAlign: 'center',
            margin: 'auto',
          }}
        >
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#0f172a',
              lineHeight: '1.2',
              marginBottom: '6px',
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '0.85rem',
              lineHeight: '1.4',
              marginBottom: '20px',
            }}
          >
            Sign in to MNC Resume Studio and continue your career journey.
          </p>

          {error && (
            <div
              role="alert"
              style={{
                color: '#dc2626',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.85rem',
                marginBottom: '12px',
                fontWeight: '600',
                textAlign: 'left',
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '4px',
                }}
              >
                Email
              </label>

              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="username"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#ffffff',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '4px',
                }}
              >
                Password
              </label>

              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#ffffff',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '4px',
                background: loading ? '#818cf8' : '#4f46e5',
                color: '#ffffff',
                padding: '11px',
                borderRadius: '8px',
                fontWeight: '650',
                fontSize: '0.9rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p
            style={{
              marginTop: '16px',
              fontSize: '0.82rem',
              color: '#64748b',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: '#4f46e5',
                fontWeight: '650',
                textDecoration: 'none',
              }}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
