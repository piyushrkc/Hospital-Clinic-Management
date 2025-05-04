// src/server.js
// Load environment variables based on NODE_ENV
const loadEnvironmentVariables = require('./config/loadEnv');
loadEnvironmentVariables();

const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/config');
const logger = require('./utils/logger');
const cacheService = require('./services/cacheService');

// Connect to database
connectDB();

// Set port from config
const PORT = config.app.port;
const ENV = config.app.env;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${ENV} environment on port ${PORT}`);
  
  // Log different information based on environment
  if (ENV !== 'production') {
    logger.info('Configuration loaded', {
      environment: ENV,
      database: config.db.uri.replace(/:([^:@]+)@/, ':****@'), // Hide password
      jwtExpiration: config.jwt.expiresIn,
      emailService: config.email.host,
      corsOrigin: process.env.CORS_ORIGIN,
      cacheEnabled: config.cache.enabled
    });
  }
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Graceful shutdown function
function gracefulShutdown() {
  logger.info('Received shutdown signal, closing server and connections...');
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    // Close Redis connection if enabled
    if (config.cache.enabled) {
      cacheService.close();
      logger.info('Redis connection closed');
    }
    
    // Any other cleanup here
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  });
  
  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 10000);
}