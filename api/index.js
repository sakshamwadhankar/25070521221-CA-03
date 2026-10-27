// api/index.js — Vercel Serverless Entry Point
// Vercel invokes this file for every /api/* request.
// We connect to MongoDB once per cold-start and reuse the connection on warm starts.

const { connectDB } = require('../server/src/config/db');
const app = require('../server/src/server');

// Ensure DB is connected before handling any request.
// connectDB() caches the connection so this is a no-op on warm invocations.
let dbReady = false;

module.exports = async (req, res) => {
  if (!dbReady) {
    try {
      await connectDB();
      dbReady = true;
    } catch (err) {
      console.error('DB connection failed on serverless cold-start:', err.message);
      return res.status(503).json({
        success: false,
        message: 'Database unavailable. Check MONGO_URI in Vercel environment variables.',
      });
    }
  }
  return app(req, res);
};
