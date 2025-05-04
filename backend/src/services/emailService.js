// src/services/emailService.js
const { Resend } = require('resend');
const config = require('../config/config');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    // Initialize Resend with API key
    this.resend = new Resend(config.email.resendApiKey);
    this.defaultFrom = config.email.from || 'Hospital Management <noreply@hospital.com>';
    this.isConfigured = !!config.email.resendApiKey;
    
    if (!this.isConfigured) {
      logger.warn('Resend API key not configured. Email sending will be disabled.');
    } else {
      logger.info('Email service initialized with Resend');
    }
  }

  /**
   * Send email using Resend
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content (optional)
   * @param {string} options.from - Sender email (optional)
   * @returns {Promise} - Promise resolving to sent email data
   */
  async sendEmail({ to, subject, text, html, from }) {
    if (!this.isConfigured) {
      logger.warn('Email sending attempted but Resend is not configured');
      return { id: null, message: 'Email service not configured' };
    }

    try {
      const data = await this.resend.emails.send({
        from: from || this.defaultFrom,
        to,
        subject,
        text,
        html: html || undefined,
      });

      logger.info('Email sent successfully', { 
        to, 
        subject, 
        id: data.id 
      });

      return data;
    } catch (error) {
      logger.error('Failed to send email', { 
        error: error.message, 
        to, 
        subject 
      });
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param {Object} user - User object
   * @param {string} resetToken - Password reset token
   * @param {string} resetUrl - URL for password reset
   * @returns {Promise} - Promise resolving to sent email data
   */
  async sendPasswordResetEmail(user, resetToken, resetUrl) {
    const subject = 'Password Reset Request';
    const text = `
      Hello ${user.firstName},

      You requested a password reset for your Hospital Management account.

      Please use the following link to reset your password:
      ${resetUrl}

      This link is valid for 10 minutes.

      If you did not request a password reset, please ignore this email.

      Regards,
      Hospital Management Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName},</p>
        <p>You requested a password reset for your Hospital Management account.</p>
        <p>Please click the button below to reset your password:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
            Reset Password
          </a>
        </p>
        <p>This link is valid for 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Regards,<br>Hospital Management Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  }

  /**
   * Send welcome email to new user
   * @param {Object} user - User object
   * @returns {Promise} - Promise resolving to sent email data
   */
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Hospital Management System';
    const text = `
      Hello ${user.firstName},

      Welcome to the Hospital Management System!

      Your account has been created successfully.

      You can now log in and start using our services.

      Regards,
      Hospital Management Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Hospital Management System</h2>
        <p>Hello ${user.firstName},</p>
        <p>Welcome to the Hospital Management System!</p>
        <p>Your account has been created successfully.</p>
        <p>You can now log in and start using our services.</p>
        <p>Regards,<br>Hospital Management Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  }

  /**
   * Send appointment confirmation email
   * @param {Object} appointment - Appointment details
   * @param {Object} patient - Patient details
   * @param {Object} doctor - Doctor details
   * @returns {Promise} - Promise resolving to sent email data
   */
  async sendAppointmentConfirmation(appointment, patient, doctor) {
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleDateString();
    const subject = 'Appointment Confirmation';
    
    const text = `
      Hello ${patient.firstName},

      Your appointment with Dr. ${doctor.firstName} ${doctor.lastName} has been confirmed.

      Date: ${appointmentDate}
      Time: ${appointment.appointmentTime}

      Please arrive 15 minutes before your scheduled time.

      Regards,
      Hospital Management Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Appointment Confirmation</h2>
        <p>Hello ${patient.firstName},</p>
        <p>Your appointment with Dr. ${doctor.firstName} ${doctor.lastName} has been confirmed.</p>
        <div style="background-color: #f2f2f2; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Date:</strong> ${appointmentDate}</p>
          <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
          <p><strong>Doctor:</strong> Dr. ${doctor.firstName} ${doctor.lastName}</p>
          <p><strong>Reason:</strong> ${appointment.reason}</p>
        </div>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Regards,<br>Hospital Management Team</p>
      </div>
    `;

    return this.sendEmail({
      to: patient.email,
      subject,
      text,
      html
    });
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;