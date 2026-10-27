import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const SKILL_CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Communication',
  'Languages',
  'Music',
  'Sports',
  'Academics',
  'Other',
];

const Signup = () => {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science',
    year: '2nd Year (Sophomore)',
    bio: '',
    initialOfferedSkill: '',
    initialWantedSkill: '',
    category: 'Programming',
    level: 'Intermediate',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in your name, email, and password');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await signup(formData);
      toast.success(`Welcome to Edu Exchange, ${data.user?.name || 'Student'}! Your account is ready.`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '20px auto 40px' }}>
      <div
        className="card-neo card-neo-cream"
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
              background: 'var(--mint-green)',
            }}
          >
            &lt;/&gt; EDU EXCHANGE
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>
            Join Edu Exchange
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Share skills. Build connections. Grow together with classmates.
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

        <form onSubmit={handleSubmit}>
          {/* Full Name & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group-neo">
              <label className="form-label-neo" htmlFor="signup-name">
                Full Name *
              </label>
              <input
                id="signup-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Maya Lin"
                className="form-input-neo"
                required
              />
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo" htmlFor="signup-email">
                University Email *
              </label>
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="maya@student.edu"
                className="form-input-neo"
                required
              />
            </div>
          </div>

          {/* Department & Year of Study */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group-neo">
              <label className="form-label-neo" htmlFor="signup-dept">
                Department / Major *
              </label>
              <select
                id="signup-dept"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input-neo"
                required
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo" htmlFor="signup-year">
                Year of Study *
              </label>
              <select
                id="signup-year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input-neo"
                required
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group-neo">
              <label className="form-label-neo" htmlFor="signup-pass">
                Password (min. 6 chars) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-pass"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  className="form-input-neo"
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
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <div className="form-group-neo">
              <label className="form-label-neo" htmlFor="signup-confirm-pass">
                Confirm Password *
              </label>
              <input
                id="signup-confirm-pass"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="form-input-neo"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="form-group-neo">
            <label className="form-label-neo" htmlFor="signup-bio">
              Short Student Bio
            </label>
            <textarea
              id="signup-bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell classmates about your academic interests, projects, or what you're passionate about..."
              className="form-input-neo"
              rows="2"
            />
          </div>

          {/* Optional Initial Skill Offering Section (Warm Yellow card) */}
          <div
            style={{
              background: 'var(--warm-yellow)',
              border: 'var(--border-black)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-black-sm)',
              padding: '18px 20px',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge-neo badge-neo-black">Optional Quick Start</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.88rem' }}>List your first skill trade now</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              You can always add, edit, or remove skills anytime from your student dashboard.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <div>
                <label className="form-label-neo" style={{ fontSize: '0.76rem' }}>
                  Skill You Can Teach
                </label>
                <input
                  type="text"
                  name="initialOfferedSkill"
                  value={formData.initialOfferedSkill}
                  onChange={handleChange}
                  placeholder="e.g. Python, UI Design, Guitar"
                  className="form-input-neo"
                />
              </div>

              <div>
                <label className="form-label-neo" style={{ fontSize: '0.76rem' }}>
                  Skill Wanted in Exchange
                </label>
                <input
                  type="text"
                  name="initialWantedSkill"
                  value={formData.initialWantedSkill}
                  onChange={handleChange}
                  placeholder="e.g. React, Algorithms, Spanish"
                  className="form-input-neo"
                />
              </div>
            </div>

            {formData.initialOfferedSkill && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 12 }}>
                <div>
                  <label className="form-label-neo" style={{ fontSize: '0.76rem' }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input-neo"
                  >
                    {SKILL_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label-neo" style={{ fontSize: '0.76rem' }}>
                    Proficiency Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="form-input-neo"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', fontSize: '0.96rem' }}
            disabled={loading}
          >
            {loading ? 'Creating your account...' : 'Create Student Account ➔'}
          </button>
        </form>

        {/* Footer Link */}
        <p
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.86rem',
            marginTop: 22,
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
