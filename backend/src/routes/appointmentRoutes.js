// src/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all appointments with filtering options
router.get('/', appointmentController.getAppointments);

// Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Create new appointment
// Patients, doctors, receptionists, and admins can create appointments
router.post('/', authorize('patient', 'doctor', 'admin', 'receptionist'), 
  appointmentController.createAppointment);

// Update appointment 
router.put('/:id', authorize('patient', 'doctor', 'admin', 'receptionist'),
  appointmentController.updateAppointment);

// Cancel appointment
router.put('/:id/cancel', appointmentController.cancelAppointment);

// Delete appointment (admin only)
router.delete('/:id', authorize('admin'), appointmentController.deleteAppointment);

// Get doctor's schedule/availability
router.get('/doctor/schedule', appointmentController.getDoctorSchedule);

// Get appointment statistics (admin, doctor, receptionist)
router.get('/stats/summary', authorize('admin', 'doctor', 'receptionist'),
  appointmentController.getAppointmentStats);

module.exports = router;