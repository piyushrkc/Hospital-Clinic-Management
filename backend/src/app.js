// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const indexRoutes = require('./routes/indexRoutes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body

// Routes
app.use('/api', indexRoutes); // Use all routes defined in indexRoutes

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hospital Management System API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

module.exports = app;