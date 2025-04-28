const express = require('express');
const doctorController = require('../controllers/doctorController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Restrict certain routes to specific roles
router.use(authController.restrictTo('admin', 'staff'));

router
  .route('/')
  .get(doctorController.getAllDoctors)
  .post(doctorController.createDoctor);

router
  .route('/:id')
  .get(doctorController.getDoctor)
  .patch(doctorController.updateDoctor)
  .delete(authController.restrictTo('admin'), doctorController.deleteDoctor);

router.route('/:id/schedule')
  .get(doctorController.getDoctorSchedule);

router.route('/:id/availability')
  .patch(doctorController.setAvailability);

router.route('/:id/patients')
  .get(doctorController.getDoctorPatients);

router.route('/:id/queue')
  .get(doctorController.getDoctorQueue);

module.exports = router;