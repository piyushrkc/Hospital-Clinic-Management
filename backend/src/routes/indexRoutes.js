const express = require('express');
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const prescriptionRoutes = require('./prescriptionRoutes');
const labRoutes = require('./labRoutes');
const pharmacyRoutes = require('./pharmacyRoutes');
const billingRoutes = require('./billingRoutes');
const notificationRoutes = require('./notificationRoutes');
const reportRoutes = require('./reportRoutes');
const uploadRoutes = require('./uploadRoutes');

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/lab', labRoutes);
router.use('/pharmacy', pharmacyRoutes);
router.use('/billing', billingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;