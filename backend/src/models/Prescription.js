// backend/src/models/Prescription.js
const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructions: {
    type: String
  },
  quantity: {
    type: Number,
    required: true
  },
  dispensed: {
    type: Boolean,
    default: false
  },
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dispensedDate: {
    type: Date
  }
});

const PrescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  medications: [MedicationSchema],
  diagnosis: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  refillCount: {
    type: Number,
    default: 0
  },
  maxRefills: {
    type: Number,
    default: 0
  },
  qrCode: {
    type: String
  },
  digitalSignature: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
PrescriptionSchema.index({ patient: 1, issuedDate: -1 });
PrescriptionSchema.index({ doctor: 1, issuedDate: -1 });
PrescriptionSchema.index({ hospital: 1 });
PrescriptionSchema.index({ status: 1 });

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

module.exports = Prescription;