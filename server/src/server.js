const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables (local dev only – Vercel uses project env vars)
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const requestRoutes = require('./routes/requestRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// In production: allow Vercel deployment domains + any custom domain.
// Locally: allow localhost variants.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin (curl / mobile) and all origins in dev
      if (!origin) return callback(null, true);

      // Allowed patterns
      const allowed =
        !origin ||                                         // curl / same-origin
        origin.startsWith('http://localhost') ||           // local dev
        origin.startsWith('http://127.0.0.1') ||          // local dev
        origin.includes('vercel.app') ||                   // Vercel preview & production
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL); // custom domain

      return callback(null, allowed ? true : new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Edu Exchange – Student Skill Exchange Platform',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Error middleware ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Startup ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Only listen when running directly (local dev).
// On Vercel, api/index.js exports the app and Vercel manages the HTTP server.
if (require.main === module) {
  connectDB()
    .then(async () => {
      const User = require('./models/User');
      const { seedData } = require('./utils/seed');
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('🌱 Empty database – auto-seeding initial student data...');
          await seedData(false);
        }
      } catch (seedErr) {
        console.warn('⚠️ Auto-seed check notice:', seedErr.message);
      }

      app.listen(PORT, () => {
        console.log(`🚀 Edu Exchange running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`📡 Health: http://localhost:${PORT}/api/health`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;
