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

    // Client-side Validation
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

  // Quick demo filler
  const handleDemoFill = (email, pass) => {
    setFormData({ email, password: pass });
    setError('');
  };

  return (
    <div
      className="page-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - var(--nav-height))',
      }}
    >
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '36px 30px', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div
              className="brand-icon"
              style={{ margin: '0 auto 14px', width: 44, height: 44, fontSize: '1.4rem' }}
            >
              F
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: 6 }}>
              Student Sign In
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Sign in to manage your skills, requests, and projects
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.86rem',
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
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@university.edu"
                className="form-input"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
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
                  placeholder="Enter your password"
                  className="form-input"
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
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
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
              style={{ width: '100%', padding: '12px', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid var(--border)',
            }}
          >
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
              Quick Demo Accounts (1-Click Fill)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleDemoFill('alex@flexi.com', 'Demo123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                👤 Alex (Comp Sci)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('riya@flexi.com', 'Demo123')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                🎨 Riya (Design/IT)
              </button>
            </div>
          </div>

          {/* Footer Link to Signup */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              marginTop: 20,
            }}
          >
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              style={{ color: 'var(--primary)', fontWeight: 700 }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
