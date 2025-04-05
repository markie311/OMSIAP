require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import route files
const peoplesRoute = require('./routes/people/peoplesRoute');
const productsRoute = require('./routes/products/productsRoute');
const omsiapRoute = require('./routes/omsiap/omsiapRoute');

// MongoDB Connection Configuration
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Removed deprecated options
      maxPoolSize: 50, // Supports 50 simultaneous connections
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      serverSelectionTimeoutMS: 30000, // 30 seconds server selection timeout
      heartbeatFrequencyMS: 10000, // Connection health check every 10 seconds
      retryWrites: true,
      dbName: process.env.DB_NAME
    });
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    // Implement exponential backoff for reconnection
    const reconnectDelay = Math.min(30000, Math.pow(2, reconnectAttempts) * 1000);
    setTimeout(connectToDatabase, reconnectDelay);
    reconnectAttempts++;
  }
};

// Reconnection attempt tracker
let reconnectAttempts = 0;

// Create Express App
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware Configuration
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection Event Listeners
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to database');
  // Reset reconnection attempts on successful connection
  reconnectAttempts = 0;
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
  connectToDatabase(); // Attempt to reconnect
});

// Routes
app.use('/people/', peoplesRoute);
app.use('/products/', productsRoute);
app.use('/omsiap/', omsiapRoute);

// Optional: Health Check Endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    reconnectAttempts: reconnectAttempts
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start Server
const startServer = async () => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    // Then start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on PORT ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});

// Kick off the server
startServer();