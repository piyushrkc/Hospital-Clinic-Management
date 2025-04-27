// backend/src/models/LabTest.js
const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  parameter: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  unit: {
    type: String
  },
  referenceRange: {
    min: Number,
    max: Number,
    text: String
  },
  flag: {
    type: String,
    enum: ['normal', 'low', 'high', 'critical-low', 'critical-high'],
    default: 'normal'
  },
  notes: {
    type: String
  }
});

const LabTestSchema = new mongoose.Schema({
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
  testType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['hematology', 'biochemistry', 'microbiology', 'pathology', 'radiology', 'other'],
    required: true
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'stat'],
    default: 'routine'
  },
  status: {
    type: String,
    enum: ['ordered', 'collected', 'in-process', 'completed', 'cancelled'],
    default: 'ordered'
  },
  orderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderedDate: {
    type: Date,
    default: Date.now
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  collectionDate: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processingDate: {
    type: Date
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportDate: {
    type: Date
  },
  results: [TestResultSchema],
  conclusion: {
    type: String
  },
  notes: {
    type: String
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isViewed: {
    type: Boolean,
    default: false
  },
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  billing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Billing'
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
LabTestSchema.index({ patient: 1, orderedDate: -1 });
LabTestSchema.index({ doctor: 1 });
LabTestSchema.index({ hospital: 1 });
LabTestSchema.index({ status: 1 });
LabTestSchema.index({ testType: 1 });
LabTestSchema.index({ category: 1 });

const LabTest = mongoose.model('LabTest', LabTestSchema);

module.exports = LabTest;