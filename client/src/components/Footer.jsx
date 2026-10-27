import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer" style={{ borderTop: '3px solid var(--black)', background: 'var(--black)', color: 'var(--white)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 10px' }}>
        <div className="footer-top">
          {/* Brand info */}
          <div className="footer-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 12 }}>
              <div className="brand-badge" style={{ background: 'var(--warm-yellow)', color: 'var(--black)' }}>&lt;/&gt;</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--white)' }}>
                EDU EXCHANGE
              </span>
            </Link>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--warm-yellow)' }}>
              “Share Skills. Build Connections. Grow Together.”
            </p>
            <p style={{ marginTop: 8, fontSize: '0.82rem', color: '#aaaaaa', fontFamily: 'var(--font-mono)' }}>
              The student-to-student skill exchange and project collaboration platform for colleges and universities.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/skills" className="footer-link">Explore Skills</Link></li>
              <li><Link to="/projects" className="footer-link">Browse Projects</Link></li>
              <li><Link to="/dashboard" className="footer-link">Student Dashboard</Link></li>
              <li><Link to="/requests" className="footer-link">Exchange Requests</Link></li>
            </ul>
          </div>

          {/* Skill Categories */}
          <div>
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/skills?category=Programming" className="footer-link">Programming</Link></li>
              <li><Link to="/skills?category=Design" className="footer-link">UI/UX & Design</Link></li>
              <li><Link to="/skills?category=Business" className="footer-link">Business & Pitch</Link></li>
              <li><Link to="/skills?category=Languages" className="footer-link">Languages</Link></li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div>
            <h4 className="footer-heading">Community</h4>
            <ul className="footer-links">
              <li><Link to="/signup" className="footer-link">Join as Student</Link></li>
              <li><Link to="/login" className="footer-link">Student Portal</Link></li>
              <li><a href="#how-it-works" className="footer-link">How Edu Exchange Works</a></li>
              <li><span className="footer-link" style={{ color: 'var(--mint-green)' }}>100% Free Peer Learning</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Edu Exchange. All rights reserved.</p>
          <p>Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
