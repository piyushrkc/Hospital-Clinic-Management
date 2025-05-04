const redis = require('redis');
const { promisify } = require('util');
const logger = require('../utils/logger');
const config = require('../config/config');

// Default TTL in seconds (10 minutes)
const DEFAULT_TTL = 600;

class CacheService {
  constructor() {
    this.isConnected = false;
    this.client = null;
    this.getAsync = null;
    this.setexAsync = null;
    this.delAsync = null;
    this.flushallAsync = null;
    this.keysAsync = null;
    this.connect();
  }

  connect() {
    try {
      // Create Redis client
      const redisUrl = config.REDIS_URL || 'redis://localhost:6379';
      this.client = redis.createClient({
        url: redisUrl,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error
            logger.error('Redis connection refused', { error: options.error });
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after 1 hour
            logger.error('Redis retry time exhausted', { total_retry_time: options.total_retry_time });
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            // End reconnecting after 10 attempts
            logger.error('Redis max retry attempts reached', { attempts: options.attempt });
            return new Error('Max retry attempts reached');
          }
          // Reconnect after
          return Math.min(options.attempt * 100, 3000);
        },
      });

      // Promisify Redis methods
      this.getAsync = promisify(this.client.get).bind(this.client);
      this.setexAsync = promisify(this.client.setex).bind(this.client);
      this.delAsync = promisify(this.client.del).bind(this.client);
      this.flushallAsync = promisify(this.client.flushall).bind(this.client);
      this.keysAsync = promisify(this.client.keys).bind(this.client);

      // Event listeners
      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis client connected');
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        logger.error('Redis client error', { error: err.message });
      });

      this.client.on('end', () => {
        this.isConnected = false;
        logger.info('Redis client disconnected');
      });
    } catch (error) {
      logger.error('Error initializing Redis client', { error: error.message });
      this.isConnected = false;
    }
  }

  /**
   * Generate a cache key from the request
   * @param {Object} req - Express request object
   * @returns {String} Cache key
   */
  generateKey(req) {
    const path = req.originalUrl || req.url;
    const method = req.method;
    const userId = req.user ? req.user.id : 'anonymous';
    
    // For GET requests, include query params in key
    // For POST/PUT/PATCH, include body data hash
    const key = `${method}:${path}:${userId}`;
    return key;
  }

  /**
   * Get data from cache
   * @param {String} key - Cache key
   * @returns {Promise<Object|null>} Cached data or null
   */
  async get(key) {
    if (!this.isConnected) return null;
    
    try {
      const data = await this.getAsync(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Set data in cache
   * @param {String} key - Cache key
   * @param {Object} data - Data to cache
   * @param {Number} ttl - Time to live in seconds (optional)
   * @returns {Promise<Boolean>} Success flag
   */
  async set(key, data, ttl = DEFAULT_TTL) {
    if (!this.isConnected) return false;
    
    try {
      const serialized = JSON.stringify(data);
      await this.setexAsync(key, ttl, serialized);
      return true;
    } catch (error) {
      logger.error('Cache set error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Delete data from cache
   * @param {String} key - Cache key
   * @returns {Promise<Boolean>} Success flag
   */
  async del(key) {
    if (!this.isConnected) return false;
    
    try {
      await this.delAsync(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Clear all cache
   * @returns {Promise<Boolean>} Success flag
   */
  async flush() {
    if (!this.isConnected) return false;
    
    try {
      await this.flushallAsync();
      return true;
    } catch (error) {
      logger.error('Cache flush error', { error: error.message });
      return false;
    }
  }

  /**
   * Clear cache by pattern
   * @param {String} pattern - Key pattern to clear
   * @returns {Promise<Number>} Number of keys deleted
   */
  async clearPattern(pattern) {
    if (!this.isConnected) return 0;
    
    try {
      const keys = await this.keysAsync(pattern);
      if (keys.length === 0) return 0;
      
      await this.delAsync(keys);
      return keys.length;
    } catch (error) {
      logger.error('Cache clear pattern error', { pattern, error: error.message });
      return 0;
    }
  }

  /**
   * Close Redis connection
   */
  close() {
    if (this.client) {
      this.client.quit();
      this.isConnected = false;
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

module.exports = cacheService;