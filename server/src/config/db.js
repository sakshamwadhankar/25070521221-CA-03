const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flexi';

  try {
    // Attempt standard connection with a short timeout so we know quickly if local mongod is active
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`⚠️ Could not connect to primary MongoDB URI (${uri}): ${err.message}`);
    console.log('🔄 Initializing embedded in-memory MongoDB fallback so you can run immediately without setup...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'flexi' }
      });
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ In-Memory MongoDB Connected at: ${memUri}`);
      console.log('ℹ️ Tip: Start MongoDB or MongoDB Compass on mongodb://127.0.0.1:27017/flexi for persistent storage.');
      return conn;
    } catch (memErr) {
      console.error('❌ Failed to connect to both primary and in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
