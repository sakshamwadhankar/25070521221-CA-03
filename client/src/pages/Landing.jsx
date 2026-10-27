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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {/* Editorial Hero Section */}
      <section
        className="card-neo card-neo-cream"
        style={{
          border: 'var(--border-black-thick)',
          padding: '44px 36px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <div
            className="badge-neo badge-neo-yellow"
            style={{ marginBottom: 18, fontSize: '0.82rem', padding: '6px 14px' }}
          >
            🎓 The Peer-to-Peer Student Skill Exchange
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)',
              lineHeight: 1.15,
              marginBottom: 16,
              color: 'var(--black)',
            }}
          >
            Share Skills. Build Connections.{' '}
            <span style={{ background: 'var(--warm-yellow)', padding: '0 8px', border: '2px solid #111' }}>
              Grow Together.
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
              color: 'var(--text-muted)',
              maxWidth: '720px',
              margin: '0 auto 32px',
              lineHeight: 1.6,
            }}
          >
            Edu Exchange connects ambitious college students to trade real-world coding,
            design, and academic skills, form project teams, and accelerate learning 1-on-1.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 36,
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
                <Link to="/login" className="btn btn-warning btn-lg">
                  Student Sign In
                </Link>
              </>
            )}
            <Link to="/skills" className="btn btn-secondary btn-lg">
              Explore Skills ⚡
            </Link>
          </div>

          {/* Editorial Stat Sub-blocks (Like reference image) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 14,
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            <div className="stat-subblock">
              <div className="stat-subblock-num">500+</div>
              <div className="stat-subblock-label">Students Active</div>
            </div>
            <div className="stat-subblock">
              <div className="stat-subblock-num">20+</div>
              <div className="stat-subblock-label">Skills Shared</div>
            </div>
            <div className="stat-subblock">
              <div className="stat-subblock-num">100%</div>
              <div className="stat-subblock-label">Peer-to-Peer Free</div>
            </div>
            <div className="stat-subblock">
              <div className="stat-subblock-num">1-on-1</div>
              <div className="stat-subblock-label">Direct Mentorship</div>
            </div>
          </div>
        </div>
      </section>

      {/* “I Can Teach” vs “I Want to Learn” Concept Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="badge-neo badge-neo-mint" style={{ marginBottom: 8 }}>
            The Skill Swapping Formula
          </span>
          <h2 style={{ fontSize: '2.1rem', marginTop: 4 }}>How Edu Exchange Works</h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Every student has a strength someone else needs. Trade your knowledge directly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Box 1: I Can Teach (Yellow card) */}
          <div
            className="card-neo card-neo-yellow"
            style={{ padding: '32px 28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ fontSize: '2rem', padding: '6px', background: 'var(--white)', border: '2px solid #111', borderRadius: '4px' }}>
                💡
              </span>
              <h3 style={{ fontSize: '1.6rem', margin: 0 }}>“I Can Teach”</h3>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20 }}>
              List skills you’re confident in — whether it’s building React components, creating Figma design systems, solving graph algorithms, or speaking fluent German.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge-neo badge-neo-black" style={{ padding: '2px 6px' }}>✓</span>
                Reinforce your knowledge through active peer teaching
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge-neo badge-neo-black" style={{ padding: '2px 6px' }}>✓</span>
                Boost your resume with mentorship credentials
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge-neo badge-neo-black" style={{ padding: '2px 6px' }}>✓</span>
                Earn community reviews and exchange completions
              </li>
            </ul>
          </div>

          {/* Box 2: I Want to Learn (Pink card) */}
          <div
            className="card-neo card-neo-pink"
            style={{ padding: '32px 28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span style={{ fontSize: '2rem', padding: '6px', background: 'var(--white)', border: '2px solid #111', borderRadius: '4px' }}>
                🎯
              </span>
              <h3 style={{ fontSize: '1.6rem', margin: 0 }}>“I Want to Learn”</h3>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 20 }}>
              Find a classmate who already excels at the exact skill you need. Learn through 1-on-1 sessions, pair programming, and direct project feedback.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge-neo badge-neo-black" style={{ padding: '2px 6px' }}>✓</span>
                Learn faster without paying for pricey online courses
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge-neo badge-neo-black" style={{ padding: '2px 6px' }}>✓</span>
                Get immediate answers to tricky college assignments
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge-neo badge-neo-black" style={{ padding: '2px 6px' }}>✓</span>
                Form hackathon squads and co-working circles
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How Edu Exchange Works in 3 Steps */}
      <section id="how-it-works">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="badge-neo badge-neo-peach" style={{ marginBottom: 8 }}>
            Simple 3-Step Process
          </span>
          <h2 style={{ fontSize: '2.1rem', marginTop: 4 }}>How It Works in 3 Steps</h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Get matched and start swapping skills with fellow students in under 2 minutes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {/* Step 1 */}
          <div className="card-neo card-neo-mint" style={{ padding: '28px 22px' }}>
            <div
              style={{
                width: 44,
                height: 44,
                border: 'var(--border-black)',
                background: 'var(--black)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: 16,
                boxShadow: 'var(--shadow-black-sm)',
              }}
            >
              01
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Create Your Profile</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Sign up with your campus email, add your department and year, and list the skills you can teach and want to learn.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-neo card-neo-cream" style={{ padding: '28px 22px' }}>
            <div
              style={{
                width: 44,
                height: 44,
                border: 'var(--border-black)',
                background: 'var(--warm-yellow)',
                color: 'var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: 16,
                boxShadow: 'var(--shadow-black-sm)',
              }}
            >
              02
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Send Trade Request</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Browse skills by category, filter by proficiency level, and send a personalized exchange offer to any student.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-neo card-neo-peach" style={{ padding: '28px 22px' }}>
            <div
              style={{
                width: 44,
                height: 44,
                border: 'var(--border-black)',
                background: 'var(--soft-pink)',
                color: 'var(--black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: 16,
                boxShadow: 'var(--shadow-black-sm)',
              }}
            >
              03
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Learn & Build</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Once accepted, connect to exchange knowledge, collaborate on campus projects, and mark your exchange as completed!
            </p>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <span className="badge-neo badge-neo-yellow" style={{ marginBottom: 6 }}>Live Marketplace</span>
            <h2 style={{ fontSize: '2.1rem', marginTop: 4 }}>Featured Student Skills</h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Real skills offered right now by students across university departments.
            </p>
          </div>
          <Link to="/skills" className="btn btn-secondary">
            View All Skills ➔
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading live skills from database..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {featuredSkills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>
        )}
      </section>

      {/* Student Reviews & Performance Section (Inspired by reference bottom row) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Students reviews & activity</h2>
          <Link to="/skills" className="btn btn-secondary btn-sm">
            View all
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Pink Rating & Wave Chart Card */}
          <div className="card-neo card-neo-pink" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700 }}>★ 4.9 / 5.0</span>
                <span className="badge-neo badge-neo-white">See stats</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>
                127+ exchanges
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Completed between students
              </div>
            </div>

            {/* Retro zigzag / wave chart line from reference */}
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '2px solid #111' }}>
              <svg className="wave-chart-line" viewBox="0 0 200 40">
                <path d="M 5 30 Q 30 5, 60 25 T 120 15 T 170 28 T 195 10" />
              </svg>
            </div>
          </div>

          {/* Review Card 1 */}
          <div className="card-neo card-neo-white">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>Nicol W.</strong>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>Computer Science, 3rd Yr</div>
              </div>
              <span className="badge-neo badge-neo-yellow">★ 4.9</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              "The progress I made learning Node.js and full-stack development through Edu Exchange is immense. I traded Figma lessons for backend mentorship."
            </p>
          </div>

          {/* Review Card 2 */}
          <div className="card-neo card-neo-white">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>Stephanie N.</strong>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>Design & Media, 2nd Yr</div>
              </div>
              <span className="badge-neo badge-neo-mint">★ 5.0</span>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              "I learned React components in just three weeks from an engineering peer. We ended up building our capstone project together on the platform!"
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Call to Action Banner */}
      <section
        className="card-neo card-neo-yellow"
        style={{
          padding: '40px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <span className="badge-neo badge-neo-black">Ready to get started?</span>
        <h2 style={{ fontSize: '2.4rem', maxWidth: '700px', lineHeight: 1.2 }}>
          Trade Skills, Build Real Projects, and Excel in College.
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
          Join hundreds of students today on Edu Exchange. Free, peer-driven, and designed for higher education success.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create Free Account ➔
          </Link>
          <Link to="/skills" className="btn btn-white btn-lg">
            Browse All Skills
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
