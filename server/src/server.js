const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load .env for local dev (Vercel injects env vars automatically in production)
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const requestRoutes = require('./routes/requestRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow all Vercel domains + localhost for dev
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1') ||
        origin.includes('vercel.app') ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for student project
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Edu Exchange',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Routes
// Every data request waits for the shared connection, including serverless cold starts.
// A failed connection returns JSON rather than exiting the Vercel function process.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database unavailable:', err.name);
    res.status(503).json({
      success: false,
      message: 'Database unavailable. Check MONGO_URI and MongoDB network access.',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
// Only the local CLI starts a listener and initializes demo data.
// Importing the app from api/index.js must not start a server or seed the database.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(async () => {
      try {
        const User = require('./models/User');
        const { seedData } = require('./utils/seed');
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('🌱 Empty database – auto-seeding initial student data...');
          await seedData(false);
        }
      } catch (seedErr) {
        console.warn('⚠️ Auto-seed notice:', seedErr.message);
      }

      app.listen(PORT, () => {
        console.log(`🚀 Edu Exchange API running on port ${PORT}`);
        console.log(`📡 Health: http://localhost:${PORT}/api/health`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
