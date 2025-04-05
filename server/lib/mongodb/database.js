const mongoose = require('mongoose');

// Centralized MongoDB connection function
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50, // Increase connection pool size
      socketTimeoutMS: 45000, // Increase socket timeout
      serverSelectionTimeoutMS: 30000, // Increase server selection timeout
      heartbeatFrequencyMS: 10000, // Customize heartbeat frequency
      retryWrites: true,
      dbName: process.env.DB_NAME
    });
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Implement reconnection strategy
    setTimeout(connectToDatabase, 5000);
  }
};

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
  // Attempt to reconnect
  connectToDatabase();
});

module.exports = connectToDatabase;