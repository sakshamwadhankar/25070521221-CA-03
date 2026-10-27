const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
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

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for student testing
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root / Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'FLEXI – Student Skill Exchange Platform',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const User = require('./models/User');
const { seedData } = require('./utils/seed');

// Start Server if not imported by serverless runtime
if (process.env.VERCEL !== '1' && require.main === module) {
  connectDB().then(async () => {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Empty database detected! Auto-seeding initial student data...');
        await seedData(false);
      }
    } catch (seedErr) {
      console.warn('⚠️ Auto-seed check notice:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 FLEXI Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
    });
  });
} else {
  // Connect DB on serverless invocation
  connectDB();
}

module.exports = app;
