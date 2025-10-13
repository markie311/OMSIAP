require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import route files
const peoplesRoute = require('./routes/people/peoplesRoute')
const productsRoute = require('./routes/products/productsRoute')
const omsiapRoute = require('./routes/omsiap/omsiapRoute')
const contentRoute = require('./routes/content/contentRoute')

const path = require('path');
const fs = require('fs');

// Reconnection attempt tracker
let reconnectAttempts = 0;

// MongoDB Connection Configuration
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 50, 
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000, 
      retryWrites: true,
      dbName: process.env.DB_NAME
    });
    // Don't log success here - let the 'connected' event handle it
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    // More descriptive error for authentication issues
    if (error.name === 'MongoServerError' && (error.code === 8000 || error.message.includes('auth'))) {
      console.error('🔐 Authentication failed. Please check your username and password in .env file');
    }
    
    const reconnectDelay = Math.min(30000, Math.pow(2, reconnectAttempts) * 1000);
    console.log(`⏱️ Will attempt reconnection in ${reconnectDelay/1000} seconds...`);
    setTimeout(connectToDatabase, reconnectDelay);
    reconnectAttempts++;
  }
};

// Create Express App
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware Configuration
app.use(cors({
  origin: ['http://localhost:3000','https://omsiap.onrender.com', 'https://omsiapwebservice.onrender.com/'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true
}));

{/*
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
*/}

// Add this to your main server file (app.js or server.js)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the view/public directory
app.use(express.static(path.join(__dirname, '../view/public')));

// MongoDB Connection Event Listeners
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established successfully');
  console.log('🔗 Mongoose connected to database');
  // Reset reconnection attempts on successful connection
  reconnectAttempts = 0;
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
  if (mongoose.connection.readyState !== 1) {
    // Only try to reconnect if we're not already connecting
    connectToDatabase();
  }
});

// Routes
app.use('/people/', peoplesRoute)
app.use('/products/', productsRoute)
app.use('/omsiap/', omsiapRoute)
app.use('/content/', contentRoute)

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
    
    // Start server regardless of database connection status
    // This allows the server to keep trying to connect to DB
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application continues running, but logs the error
});

// Kick off the server
startServer();