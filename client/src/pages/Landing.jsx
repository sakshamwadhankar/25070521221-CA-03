import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { skillService } from '../services/skillService';
import SkillCard from '../components/SkillCard';
import Loader from '../components/Loader';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [featuredSkills, setFeaturedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await skillService.getSkills({ limit: 6 });
        if (data?.skills) {
          setFeaturedSkills(data.skills);
        }
      } catch (err) {
        console.warn('Could not load featured skills:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          padding: '80px 0 60px',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(217, 70, 239, 0.04) 70%, transparent 100%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div
            className="badge badge-purple"
            style={{ marginBottom: 20, padding: '6px 16px', fontSize: '0.85rem' }}
          >
            🎓 The #1 Student-to-Student Skill Exchange
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              maxWidth: '850px',
              margin: '0 auto 20px',
              lineHeight: 1.15,
            }}
          >
            Learn together. Build together.{' '}
            <span className="gradient-text">Grow together.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              maxWidth: '680px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            FLEXI connects college students to trade real-world skills, master new technologies,
            and build collaborative projects together — completely free.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 48,
            }}
          >
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard ➔
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free ➔
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Student Sign In
                </Link>
              </>
            )}
            <Link to="/skills" className="btn btn-secondary btn-lg">
              Explore Skills
            </Link>
          </div>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 36,
              background: '#ffffff',
              padding: '16px 36px',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>500+</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Students</p>
            </div>
            <div style={{ width: 1, height: 36, background: 'var(--border)' }}></div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>90+</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skills Available</p>
            </div>
            <div style={{ width: 1, height: 36, background: 'var(--border)' }}></div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>100%</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Peer-to-Peer Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* “I Can Teach” vs “I Want to Learn” Concept Section */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span className="badge badge-primary" style={{ marginBottom: 12 }}>The Skill Swapping Formula</span>
            <h2 className="section-title">How Skill Exchange Works</h2>
            <p className="section-subtitle">
              Every student has a strength someone else needs. FLEXI turns your existing knowledge into currency for learning.
            </p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: 32 }}>
            {/* Box 1: I Can Teach */}
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
                borderColor: '#ddd6fe',
                padding: '36px',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  color: '#ffffff',
                  marginBottom: 20,
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                💡
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
                “I Can Teach”
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                List skills you’re confident in — whether it's building React components, creating Figma design systems, solving graph algorithms, or speaking Spanish.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--success)' }}>✓</span> Reinforce your knowledge by teaching peers
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--success)' }}>✓</span> Boost your resume with mentorship credentials
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--success)' }}>✓</span> Earn badges and student exchange ratings
                </li>
              </ul>
            </div>

            {/* Box 2: I Want to Learn */}
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                borderColor: '#bfdbfe',
                padding: '36px',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--blue-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  color: '#ffffff',
                  marginBottom: 20,
                  boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.25)',
                }}
              >
                🎯
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
                “I Want to Learn”
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                Find a classmate who already excels at the exact skill you need. Learn through 1-on-1 sessions, pair programming, and direct feedback.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span> Learn faster without pricey online bootcamps
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span> Get immediate answers to tricky college assignments
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--secondary)' }}>✓</span> Form hackathon squads and co-working circles
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How FLEXI Works in 3 Steps */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <span className="badge badge-purple" style={{ marginBottom: 12 }}>Simple Process</span>
            <h2 className="section-title">How FLEXI Works in 3 Steps</h2>
            <p className="section-subtitle">
              Get matched and start swapping skills with fellow students in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {/* Step 1 */}
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  margin: '0 auto 20px',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 10 }}>
                Create Your Profile
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Sign up with your university email, add your department and year, and list the skills you can teach and want to learn.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  margin: '0 auto 20px',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 10 }}>
                Send an Exchange Request
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Browse skills by category, filter by proficiency level, and send a personalized trade offer to any student.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  margin: '0 auto 20px',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 10 }}>
                Learn & Build Together
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Once accepted, connect to exchange knowledge, team up on student projects, and mark your exchange as completed!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 36,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 10 }}>Live Marketplace</span>
              <h2 className="section-title">Featured Student Skills</h2>
              <p className="section-subtitle">Real skills offered right now by students across departments.</p>
            </div>
            <Link to="/skills" className="btn btn-secondary">
              View All Skills ➔
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading featured skills..." />
          ) : (
            <div className="grid grid-cols-3">
              {featuredSkills.map((skill) => (
                <SkillCard key={skill._id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits for Students */}
      <section style={{ padding: '80px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 48px' }}>
            <span className="badge badge-purple" style={{ marginBottom: 12 }}>Why Students Choose FLEXI</span>
            <h2 className="section-title">Designed for Higher Education Success</h2>
            <p className="section-subtitle">Empowering students to gain practical skills and build networks before graduating.</p>
          </div>

          <div className="grid grid-cols-4">
            <div className="card" style={{ padding: '28px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚡</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Peer-to-Peer Speed</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                No bureaucracy or formal coursework. Connect directly with students who know what you need.
              </p>
            </div>

            <div className="card" style={{ padding: '28px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🚀</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Hackathon & Projects</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Discover teammates for capstone projects, coding hackathons, and research publications.
              </p>
            </div>

            <div className="card" style={{ padding: '28px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🏆</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Portfolio Credibility</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Build a track record of completed peer exchanges and collaborative projects on your public profile.
              </p>
            </div>

            <div className="card" style={{ padding: '28px 20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🤝</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Interdisciplinary Network</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Bridge the gap between Engineering, Design, Business, and Humanities students on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        style={{
          padding: '80px 0',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            Ready to exchange skills and build awesome projects?
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.88)',
              marginBottom: 36,
              lineHeight: 1.5,
            }}
          >
            Join hundreds of classmates today on FLEXI. It only takes 30 seconds to get started.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/signup"
              className="btn btn-lg"
              style={{
                background: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 700,
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              Sign Up Now – It's Free
            </Link>
            <Link
              to="/login"
              className="btn btn-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
