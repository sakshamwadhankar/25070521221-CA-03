const mongoose = require('mongoose');

// Cache the connection promise so serverless cold-starts reuse the same connection
let cachedConnection = null;

const connectDB = async () => {
  // Return cached connection if already connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      '❌ MONGO_URI environment variable is not set. ' +
      'Set it in your Vercel project settings (or .env for local dev) ' +
      'to a MongoDB Atlas connection string: mongodb+srv://...'
    );
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      // These options help with Vercel serverless connection reuse
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    return cachedConnection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cachedConnection = null;
  }
};

module.exports = { connectDB, disconnectDB };
