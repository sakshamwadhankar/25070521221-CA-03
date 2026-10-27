const mongoose = require('mongoose');

// Cache the connection promise so serverless cold-starts reuse the same connection
let connectionPromise = null;

const connectDB = async () => {
  // Return cached connection if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Concurrent cold-start requests must await the same connection attempt.
  if (connectionPromise) return connectionPromise;

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      '❌ MONGO_URI environment variable is not set. ' +
      'Set it in your Vercel project settings (or .env for local dev) ' +
      'to a MongoDB Atlas connection string: mongodb+srv://...'
    );
  }

  connectionPromise = mongoose.connect(uri, {
    // These options help with Vercel serverless connection reuse
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  try {
    return await connectionPromise;
  } finally {
    // Permit a retry after failure or a later disconnect.
    connectionPromise = null;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    connectionPromise = null;
  }
};

module.exports = { connectDB, disconnectDB };
