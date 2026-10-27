import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both your email address and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await login(formData.email.trim(), formData.password);
      toast.success(`Welcome back, ${data.user?.name || 'Student'}!`);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (email, pass) => {
    setFormData({ email, password: pass });
    setError('');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto 40px' }}>
      <div
        className="card-neo card-neo-yellow"
        style={{
          border: 'var(--border-black-thick)',
          boxShadow: 'var(--shadow-black-xl)',
          padding: '36px 32px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            className="brand-badge"
            style={{
              margin: '0 auto 12px',
              width: 'fit-content',
              fontSize: '1.15rem',
              padding: '6px 14px',
            }}
          >
            &lt;/&gt; EDU EXCHANGE
          </div>
          <h1 style={{ fontSize: '1.9rem', marginBottom: 6 }}>
            Student Sign In
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Sign in to manage your skills, requests, and campus projects
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              background: 'var(--soft-pink)',
              border: 'var(--border-black)',
              boxShadow: 'var(--shadow-black-sm)',
              padding: '10px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group-neo">
            <label className="form-label-neo" htmlFor="login-email">
              Campus Email Address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              className="form-input-neo"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group-neo">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label-neo" htmlFor="login-password">
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="form-input-neo"
                style={{ paddingRight: '45px' }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '🔒'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: 10, fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Edu Exchange ➔'}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div
          style={{
            marginTop: 26,
            paddingTop: 18,
            borderTop: '2px solid var(--black)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center', letterSpacing: '0.04em' }}>
            Quick Demo Accounts (1-Click Fill)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              onClick={() => handleDemoFill('alex@flexi.com', 'Demo123')}
              className="btn btn-secondary btn-sm"
            >
              👤 Alex (React / CS)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('riya@flexi.com', 'Demo123')}
              className="btn btn-secondary btn-sm"
            >
              🎨 Riya (Figma / IT)
            </button>
          </div>
        </div>

        {/* Footer Link to Signup */}
        <p
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.86rem',
            marginTop: 22,
          }}
        >
          Don't have an account yet?{' '}
          <Link
            to="/signup"
            style={{ fontWeight: 700, textDecoration: 'underline' }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
