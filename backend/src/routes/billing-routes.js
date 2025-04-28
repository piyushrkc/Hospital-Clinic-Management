const express = require('express');
const billingController = require('../controllers/billingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Bill routes
router
  .route('/')
  .get(
    authController.restrictTo('admin', 'staff', 'accountant'),
    billingController.getAllBills
  )
  .post(
    authController.restrictTo('admin', 'staff', 'accountant'),
    billingController.createBill
  );

router
  .route('/:id')
  .get(billingController.getBill)
  .patch(
    authController.restrictTo('admin', 'accountant'),
    billingController.updateBill
  )
  .delete(
    authController.restrictTo('admin'),
    billingController.deleteBill
  );

// Payment routes
router
  .route('/:id/payments')
  .get(billingController.getBillPayments)
  .post(
    authController.restrictTo('admin', 'staff', 'accountant'),
    billingController.recordPayment
  );

// Generate invoice PDF
router
  .route('/:id/invoice')
  .get(billingController.generateInvoicePDF);

// Get bills for a specific patient
router
  .route('/patient/:patientId')
  .get(billingController.getPatientBills);

// Get billing statistics
router
  .route('/statistics')
  .get(
    authController.restrictTo('admin', 'accountant'),
    billingController.getBillingStatistics
  );

module.exports = router;