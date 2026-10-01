const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to Database
const connectDB = require('./config/db');
connectDB();

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Frontend & Admin Static Assets directly on Localhost
app.use('/admin', express.static(path.join(__dirname, '../admin')));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '..')));

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// API Documentation Gateway (Optional JSON view)
app.get('/api-docs', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Sơn Tùng M-TP World API Gateway',
    version: '2.0.0',
    documentation: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Bearer Token required)'
      },
      tours: 'GET /api/tours',
      content: 'GET /api/content (?type=MV|Audio|BehindTheScenes)',
      products: 'GET /api/products (?category=apparel|album|lightstick)',
      orders: 'POST /api/orders',
      notifications: 'POST /api/notifications/subscribe',
      health: 'GET /api/health'
    }
  });
});

// Single Page Application (SPA) Fallback - route mọi đường dẫn về index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi hệ thống nội bộ máy chủ',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Sơn Tùng M-TP World Server is running!`);
  console.log(`🌐 Website URL:  http://localhost:${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Docs:     http://localhost:${PORT}/api-docs`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]:', err.message);
});

module.exports = app;
