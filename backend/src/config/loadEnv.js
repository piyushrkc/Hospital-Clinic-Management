// src/config/loadEnv.js

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Loads environment variables based on the current NODE_ENV
 * Priority:
 * 1. Process environment variables (already set)
 * 2. Environment-specific .env file (.env.development, .env.staging, .env.production)
 * 3. Default .env file
 */
function loadEnvironmentVariables() {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const envFile = `.env.${NODE_ENV}`;
  const envPath = path.resolve(process.cwd(), envFile);
  const defaultEnvPath = path.resolve(process.cwd(), '.env');
  
  console.log(`Loading environment from ${envFile} for ${NODE_ENV} environment`);
  
  // Load environment-specific variables
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // Only set if not already defined in process.env
    for (const key in envConfig) {
      if (!process.env[key]) {
        process.env[key] = envConfig[key];
      }
    }
  } else {
    console.warn(`Environment file ${envFile} not found.`);
  }
  
  // Load default .env as fallback
  if (fs.existsSync(defaultEnvPath)) {
    const defaultEnvConfig = dotenv.parse(fs.readFileSync(defaultEnvPath));
    
    // Only set if not already defined in process.env or environment-specific .env
    for (const key in defaultEnvConfig) {
      if (!process.env[key]) {
        process.env[key] = defaultEnvConfig[key];
      }
    }
  }
  
  // Validate critical environment variables for production
  if (NODE_ENV === 'production') {
    const criticalVars = [
      'JWT_SECRET',
      'MONGODB_URI',
      'EMAIL_USER',
      'EMAIL_PASSWORD'
    ];
    
    const missingVars = criticalVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing critical environment variables: ${missingVars.join(', ')}`);
    }
  }
}

module.exports = loadEnvironmentVariables;