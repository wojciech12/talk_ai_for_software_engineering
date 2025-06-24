const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const helloRoutes = require('./routes/hello');

// Create Express application
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Express server demonstrating Node.js best practices
 * Features:
 * - Security middleware (helmet)
 * - CORS configuration
 * - Request logging (morgan)
 * - Error handling
 * - RESTful API structure
 */

// Security and CORS middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// API routes
app.use('/api/hello', helloRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    },
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Hello World Best Practices API',
      version: '1.0.0',
      description: 'Demonstrates Node.js/Express best practices with Claude Code',
      endpoints: {
        '/health': 'GET - Health check endpoint',
        '/api/hello': 'GET - Hello world message',
        '/api/hello/custom': 'POST - Custom hello message',
      },
      documentation: 'See CLAUDE.md for development guidelines',
    },
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.originalUrl}`,
    available_endpoints: ['/api', '/api/hello', '/health'],
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running on port ${PORT}
📝 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API: http://localhost:${PORT}/api
💚 Health: http://localhost:${PORT}/health
  `);
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;