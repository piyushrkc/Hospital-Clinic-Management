// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

// Logout user
router.post('/logout', authenticate, authController.logout);

// Password reset flow
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Email verification flow
router.post('/send-verification-email', authenticate, authController.sendVerificationEmail);
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;