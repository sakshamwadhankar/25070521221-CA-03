import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science & AI',
  'Business Administration',
  'Design & Media',
  'Linguistics & Languages',
  'Bioengineering',
  'Economics & Finance',
  'Other',
];

const YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  'Postgraduate / Masters',
  'PhD / Doctorate',
];

const BeforeLoginHome = () => {
  const { isAuthenticated, login, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Signup Form State
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science',
    year: '2nd Year (Sophomore)',
    bio: '',
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password) {
      setError('Please enter both your student email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await login(loginForm.email.trim(), loginForm.password);
      toast.success(`Welcome back, ${data.user?.name || 'Student'}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password) {
      setError('Please fill in your name, email, and password');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await signup(signupForm);
      toast.success(`Welcome to Edu Exchange, ${data.user?.name || 'Student'}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Fill
  const handleDemoFill = (email, pass) => {
    setLoginForm({ email, password: pass });
    setError('');
  };

  return (
    <div style={{ width: '100%', maxWidth: '520px', margin: 'auto' }}>
      <div
        className="card-neo card-neo-cream"
        style={{
          border: 'var(--border-black-thick)',
          boxShadow: 'var(--shadow-black-xl)',
          padding: '36px 32px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            className="brand-badge"
            style={{
              margin: '0 auto 12px',
              width: 'fit-content',
              fontSize: '1.2rem',
              padding: '6px 16px',
              background: 'var(--warm-yellow)',
            }}
          >
            &lt;/&gt; EDU EXCHANGE
          </div>
          <h1 style={{ fontSize: '2.1rem', marginBottom: 6, letterSpacing: '-0.02em' }}>
            EDU EXCHANGE
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--black)',
              background: 'var(--mint-green)',
              padding: '4px 8px',
              border: '1.5px solid var(--black)',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-block',
              marginBottom: 10,
            }}
          >
            “Share Skills. Build Connections. Grow Together.”
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Private Student Skill Exchange & Project Network. Please authenticate to access campus skills and collaboration boards.
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 22,
            background: 'var(--light-gray)',
            padding: 4,
            border: '2px solid var(--black)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className="tab-neo-btn"
            style={{
              padding: '8px 0',
              textAlign: 'center',
              background: mode === 'login' ? 'var(--black)' : 'transparent',
              color: mode === 'login' ? 'var(--white)' : 'var(--black)',
              border: mode === 'login' ? '2px solid var(--black)' : '2px solid transparent',
              boxShadow: mode === 'login' ? 'var(--shadow-black-sm)' : 'none',
            }}
          >
            🔑 Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className="tab-neo-btn"
            style={{
              padding: '8px 0',
              textAlign: 'center',
              background: mode === 'signup' ? 'var(--black)' : 'transparent',
              color: mode === 'signup' ? 'var(--white)' : 'var(--black)',
              border: mode === 'signup' ? '2px solid var(--black)' : '2px solid transparent',
              boxShadow: mode === 'signup' ? 'var(--shadow-black-sm)' : 'none',
            }}
          >
            🎓 Register
          </button>
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
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* MODE 1: SIGN IN */}
        {mode === 'login' && (
          <div>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group-neo">
                <label className="form-label-neo" htmlFor="gate-email">
                  Campus Email Address
                </label>
                <input
                  id="gate-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="student@university.edu"
                  className="form-input-neo"
                  required
                />
              </div>

              <div className="form-group-neo">
                <label className="form-label-neo" htmlFor="gate-password">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="gate-password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter password"
                    className="form-input-neo"
                    style={{ paddingRight: '45px' }}
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
                {loading ? 'Authenticating...' : 'Enter Edu Exchange ➔'}
              </button>
            </form>

            {/* Quick 1-Click Demo Accounts */}
            <div
              style={{
                marginTop: 22,
                paddingTop: 16,
                borderTop: '2px solid var(--black)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  textAlign: 'center',
                  letterSpacing: '0.04em',
                }}
              >
                Quick Demo Access (1-Click Fill)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => handleDemoFill('alex@flexi.com', 'Demo123')}
                  className="btn btn-warning btn-sm"
                  style={{ fontSize: '0.76rem', padding: '7px 6px' }}
                >
                  👤 Alex (React / CS)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('riya@flexi.com', 'Demo123')}
                  className="btn btn-warning btn-sm"
                  style={{ fontSize: '0.76rem', padding: '7px 6px' }}
                >
                  🎨 Riya (Figma / IT)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: REGISTER */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit}>
            <div className="form-group-neo">
              <label className="form-label-neo">Full Name *</label>
              <input
                type="text"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="e.g. Jordan Lee"
                className="form-input-neo"
                required
              />
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo">Campus Email *</label>
              <input
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                placeholder="jordan@student.edu"
                className="form-input-neo"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group-neo">
                <label className="form-label-neo">Department</label>
                <select
                  value={signupForm.department}
                  onChange={(e) => setSignupForm({ ...signupForm, department: e.target.value })}
                  className="form-input-neo"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-neo">
                <label className="form-label-neo">Year</label>
                <select
                  value={signupForm.year}
                  onChange={(e) => setSignupForm({ ...signupForm, year: e.target.value })}
                  className="form-input-neo"
                >
                  {YEARS.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group-neo">
                <label className="form-label-neo">Password *</label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  placeholder="Min 6 chars"
                  className="form-input-neo"
                  required
                />
              </div>

              <div className="form-group-neo">
                <label className="form-label-neo">Confirm *</label>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                  placeholder="Repeat"
                  className="form-input-neo"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: 10, fontSize: '0.95rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Student Account ➔'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BeforeLoginHome;
