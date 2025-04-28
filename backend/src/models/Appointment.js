// backend/src/models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['regular', 'follow-up', 'emergency', 'telemedicine'],
    default: 'regular'
  },
  reasonForVisit: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  vitalSigns: {
    temperature: Number,
    bloodPressure: String,
    heartRate: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    height: Number,
    weight: Number
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInTime: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedTime: {
    type: Date
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  labTests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabTest'
  }],
  billing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billing'
  }
}, {
  timestamps: true
});

// Index for efficient querying
AppointmentSchema.index({ patient: 1, date: 1 });
AppointmentSchema.index({ doctor: 1, date: 1 });
AppointmentSchema.index({ hospital: 1, date: 1 });
AppointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;