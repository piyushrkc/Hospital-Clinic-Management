// backend/src/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all patients (admin, doctor, receptionist)
router.get('/', authorize('admin', 'doctor', 'receptionist'), patientController.getPatients);

// Get patient by ID
router.get('/:id', authorize('admin', 'doctor', 'receptionist', 'patient'), patientController.getPatientById);

// Create new patient (admin, receptionist)
router.post('/', authorize('admin', 'receptionist'), patientController.createPatient);

// Update patient
router.put('/:id', authorize('admin', 'receptionist'), patientController.updatePatient);

// Delete patient (admin only)
router.delete('/:id', authorize('admin'), patientController.deletePatient);

// Get patient medical history
router.get('/:id/medical-history', authorize('admin', 'doctor', 'patient'), patientController.getPatientMedicalHistory);

module.exports = router;