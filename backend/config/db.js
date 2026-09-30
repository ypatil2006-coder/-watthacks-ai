import mongoose from 'mongoose';

let isConnected = false;

// Disable command buffering so queries fail fast to graceful fallback instead of timing out
mongoose.set('bufferCommands', false);

// Global connection event listeners to prevent unhandled 'error' events from crashing the process
mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.warn('⚠️ MongoDB Connection Pool Warning:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ MongoDB Atlas Disconnected. Running with standalone fallback session store.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('🍃 MongoDB Atlas Reconnected.');
});

/**
 * Connect to MongoDB Atlas cluster
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set in environment. Running in offline/in-memory mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'watthacks',
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Atlas Connection Notice: ${error.message}`);
    console.log('⚡ Standalone in-memory session store active — fully operational.');
    return false;
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDB;
