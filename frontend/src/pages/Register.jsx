
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Welcome from './Welcome';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check password confirmation before sending to backend
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // Send BOTH passwords to AuthContext
      const success = await register(
        name,
        email,
        password,
        confirmPassword
      );

      if (success !== false) {
        navigate('/dashboard');
      } else {
        setError('User already exists or registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.password?.[0] ||
        'Something went wrong during registration.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* Background: Welcome page */}
      <div
        style={{
          filter: 'blur(2px)',
          opacity: 0.6,
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Welcome />
      </div>

      {/* Register overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          padding: '16px',
          zIndex: 1000,
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
            position: 'relative',
            zIndex: 1001,
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
            Create your account
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '0.85rem',
              lineHeight: '1.4',
              marginBottom: '20px',
            }}
          >
            Start building your professional profile and discovering opportunities.
          </p>

          {/* Error message */}
          {error && (
            <div
              style={{
                color: '#ef4444',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '9px 10px',
                fontSize: '0.85rem',
                marginBottom: '12px',
                fontWeight: '600',
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

            {/* Full Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '4px',
                }}
              >
                Full name
              </label>

              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
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
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '4px',
                }}
              >
                Confirm password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '4px',
                background: '#4f46e5',
                color: '#ffffff',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: '650',
                fontSize: '0.9rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Login link */}
          <p
            style={{
              marginTop: '16px',
              fontSize: '0.82rem',
              color: '#64748b',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#4f46e5',
                fontWeight: '650',
                textDecoration: 'none',
              }}
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
