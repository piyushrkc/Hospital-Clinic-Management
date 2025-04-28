const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const LabTest = require('../models/LabTest');
const Prescription = require('../models/Prescription');
const { catchAsync } = require('../utils/errorHandlers');
const AppError = require('../utils/appError');

// Create a new bill
exports.createBill = catchAsync(async (req, res, next) => {
  const billData = {
    ...req.body,
    createdBy: req.user.id
  };
  
  // Calculate total amount based on items
  if (billData.items && billData.items.length > 0) {
    billData.totalAmount = billData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  }
  
  // Apply discount if provided
  if (billData.discount) {
    billData.discountedAmount = billData.totalAmount - billData.discount;
  } else {
    billData.discountedAmount = billData.totalAmount;
  }
  
  // Set remaining amount
  billData.remainingAmount = billData.discountedAmount;
  
  const newBill = await Bill.create(billData);
  
  // Update related entities with billId
  if (billData.appointment) {
    await Appointment.findByIdAndUpdate(
      billData.appointment,
      { bill: newBill._id }
    );
  }
  
  if (billData.labTests && billData.labTests.length > 0) {
    await Promise.all(
      billData.labTests.map(labTestId => 
        LabTest.findByIdAndUpdate(
          labTestId,
          { bill: newBill._id }
        )
      )
    );
  }
  
  if (billData.prescriptions && billData.prescriptions.length > 0) {
    await Promise.all(
      billData.prescriptions.map(prescriptionId => 
        Prescription.findByIdAndUpdate(
          prescriptionId,
          { bill: newBill._id }
        )
      )
    );
  }
  
  // Update patient's bills reference
  await Patient.findByIdAndUpdate(
    billData.patient,
    { $push: { bills: newBill._id } }
  );
  
  res.status(201).json({
    status: 'success',
    data: {
      bill: newBill
    }
  });
});

// Get all bills
exports.getAllBills = catchAsync(async (req, res, next) => {
  // Apply filters if provided
  const filter = {};
  if (req.query.patient) filter.patient = req.query.patient;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.minDate) filter.createdAt = { $gte: new Date(req.query.minDate) };
  if (req.query.maxDate) {
    filter.createdAt = { ...filter.createdAt, $lte: new Date(req.query.maxDate) };
  }
  
  const bills = await Bill.find(filter)
    .populate('patient', 'name contactNumber')
    .populate('createdBy', 'name')
    .sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: bills.length,
    data: {
      bills
    }
  });
});

// Get a specific bill
exports.getBill = catchAsync(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id)
    .populate('patient', 'name contactNumber email address dateOfBirth')
    .populate('createdBy', 'name')
    .populate('appointment')
    .populate('labTests')
    .populate('prescriptions')
    .populate('payments');
  
  if (!bill) {
    return next(new AppError('No bill found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      bill
    }
  });
});

// Update bill
exports.updateBill = catchAsync(async (req, res, next) => {
  const billData = { ...req.body };
  
  // Recalculate totals if items are updated
  if (billData.items) {
    billData.totalAmount = billData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Apply discount if it exists or was provided
    const bill = await Bill.findById(req.params.id);
    const discount = billData.discount !== undefined ? billData.discount : bill.discount;
    
    billData.discountedAmount = billData.totalAmount - discount;
    
    // Calculate remaining amount
    const paidAmount = bill.payments.reduce((sum, payment) => {
      return sum + payment.amount;
    }, 0);
    
    billData.remainingAmount = billData.discountedAmount - paidAmount;
  } else if (billData.discount !== undefined) {
    // Only discount was updated
    const bill = await Bill.findById(req.params.id);
    billData.discountedAmount = bill.totalAmount - billData.discount;
    
    // Calculate remaining amount
    const paidAmount = bill.payments.reduce((sum, payment) => {
      return sum + payment.amount;
    }, 0);
    
    billData.remainingAmount = billData.discountedAmount - paidAmount;
  }
  
  const updatedBill = await Bill.findByIdAndUpdate(
    req.params.id,
    billData,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!updatedBill) {
    return next(new AppError('No bill found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      bill: updatedBill
    }
  });
});

// Delete bill
exports.deleteBill = catchAsync(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  
  if (!bill) {
    return next(new AppError('No bill found with that ID', 404));
  }
  
  // Can only delete bills with no payments
  if (bill.payments && bill.payments.length > 0) {
    return next(new AppError('Cannot delete a bill with payments', 400));
  }
  
  // Remove bill references from related entities
  if (bill.appointment) {
    await Appointment.findByIdAndUpdate(
      bill.appointment,
      { $unset: { bill: "" } }
    );
  }
  
  if (bill.labTests && bill.labTests.length > 0) {
    await Promise.all(
      bill.labTests.map(labTestId => 
        LabTest.findByIdAndUpdate(
          labTestId,
          { $unset: { bill: "" } }
        )
      )
    );
  }
  
  if (bill.prescriptions && bill.prescriptions.length > 0) {
    await Promise.all(
      bill.prescriptions.map(prescriptionId => 
        Prescription.findByIdAndUpdate(
          prescriptionId,
          { $unset: { bill: "" } }
        )
      )
    );
  }
  
  // Remove from patient's bills
  await Patient.findByIdAndUpdate(
    bill.patient,
    { $pull: { bills: bill._id } }
  );
  
  await Bill.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Record a payment for a bill
exports.recordPayment = catchAsync(async (req, res, next) => {
  const { amount, paymentMethod, transactionId, notes } = req.body;
  const billId = req.params.id;
  
  // Find the bill
  const bill = await Bill.findById(billId);
  
  if (!bill) {
    return next(new AppError('No bill found with that ID', 404));
  }
  
  // Check if payment amount is valid
  if (!amount || amount <= 0) {
    return next(new AppError('Payment amount must be greater than 0', 400));
  }
  
  if (amount > bill.remainingAmount) {
    return next(new AppError(`Payment amount exceeds remaining amount (${bill.remainingAmount})`, 400));
  }
  
  // Create payment record
  const newPayment = await Payment.create({
    bill: billId,
    patient: bill.patient,
    amount,
    paymentMethod,
    transactionId,
    notes,
    receivedBy: req.user.id
  });
  
  // Update bill with payment reference and remaining amount
  bill.payments.push(newPayment._id);
  bill.remainingAmount -= amount;
  
  // Update bill status
  if (bill.remainingAmount <= 0) {
    bill.status = 'paid';
  } else {
    bill.status = 'partial';
  }
  
  await bill.save();
  
  res.status(201).json({
    status: 'success',
    data: {
      payment: newPayment,
      bill: {
        id: bill._id,
        remainingAmount: bill.remainingAmount,
        status: bill.status
      }
    }
  });
});

// Get all payments for a bill
exports.getBillPayments = catchAsync(async (req, res, next) => {
  const billId = req.params.id;
  
  const payments = await Payment.find({ bill: billId })
    .populate('receivedBy', 'name')
    .sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments
    }
  });
});

// Generate invoice PDF
exports.generateInvoicePDF = catchAsync(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id)
    .populate('patient', 'name contactNumber email address dateOfBirth')
    .populate('createdBy', 'name')
    .populate({
      path: 'appointment',
      populate: {
        path: 'doctor',
        select: 'name specialization'
      }
    })
    .populate('payments');
  
  if (!bill) {
    return next(new AppError('No bill found with that ID', 404));
  }
  
  // PDF generation logic would be implemented here
  // This typically involves a library like PDFKit or using a service
  
  // For now, we'll just return a success message
  res.status(200).json({
    status: 'success',
    message: 'PDF generation would happen here',
    data: {
      bill
    }
  });
});

// Get bills for a specific patient
exports.getPatientBills = catchAsync(async (req, res, next) => {
  const patientId = req.params.patientId;
  
  const bills = await Bill.find({ patient: patientId })
    .populate('createdBy', 'name')
    .sort('-createdAt');
  
  res.status(200).json({
    status: 'success',
    results: bills.length,
    data: {
      bills
    }
  });
});

// Get billing statistics
exports.getBillingStatistics = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);
  
  const match = {};
  if (startDate || endDate) match.createdAt = dateFilter;
  
  const stats = await Bill.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalBills: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        discountedAmount: { $sum: '$discountedAmount' },
        collectedAmount: { $sum: { $subtract: ['$discountedAmount', '$remainingAmount'] } },
        pendingAmount: { $sum: '$remainingAmount' }
      }
    }
  ]);
  
  // Get payment method breakdown
  const paymentStats = await Payment.aggregate([
    { 
      $match: startDate || endDate ? { createdAt: dateFilter } : {} 
    },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        amount: { $sum: '$amount' }
      }
    }
  ]);
  
  // Format payment stats
  const paymentBreakdown = {};
  paymentStats.forEach(stat => {
    paymentBreakdown[stat._id] = {
      count: stat.count,
      amount: stat.amount
    };
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      stats: stats.length > 0 ? stats[0] : {
        totalBills: 0,
        totalAmount: 0,
        discountedAmount: 0,
        collectedAmount: 0,
        pendingAmount: 0
      },
      paymentBreakdown
    }
  });
});