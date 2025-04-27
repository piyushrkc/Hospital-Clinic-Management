// backend/src/models/Medication.js
const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genericName: {
    type: String,
    required: true
  },
  brand: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  form: {
    type: String,
    enum: ['tablet', 'capsule', 'liquid', 'injection', 'cream', 'ointment', 'drops', 'inhaler', 'powder', 'other'],
    required: true
  },
  strength: {
    value: Number,
    unit: String
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  manufacturer: {
    type: String
  },
  description: {
    type: String
  },
  sideEffects: {
    type: String
  },
  contraindications: {
    type: String
  },
  dosageInstructions: {
    type: String
  },
  inventory: {
    currentStock: {
      type: Number,
      default: 0
    },
    unitOfMeasure: {
      type: String,
      default: 'units'
    },
    batchNumber: {
      type: String
    },
    expiryDate: {
      type: Date
    },
    reorderLevel: {
      type: Number,
      default: 10
    },
    location: {
      type: String
    }
  },
  pricing: {
    costPrice: {
      type: Number,
      required: true
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  suppliers: [{
    name: String,
    contactInfo: String,
    preferredSupplier: Boolean
  }],
  status: {
    type: String,
    enum: ['active', 'low-stock', 'out-of-stock', 'discontinued', 'expired'],
    default: 'active'
  },
  needsPrescription: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  },
  barcode: {
    type: String
  }
}, {
  timestamps: true
});

// Pre-save hook to update status based on current stock
MedicationSchema.pre('save', function(next) {
  if (this.inventory.currentStock <= 0) {
    this.status = 'out-of-stock';
  } else if (this.inventory.currentStock <= this.inventory.reorderLevel) {
    this.status = 'low-stock';
  } else if (this.inventory.expiryDate && new Date(this.inventory.expiryDate) < new Date()) {
    this.status = 'expired';
  } else {
    this.status = 'active';
  }
  next();
});

// Indexes for efficient querying
MedicationSchema.index({ name: 1 });
MedicationSchema.index({ genericName: 1 });
MedicationSchema.index({ hospital: 1 });
MedicationSchema.index({ category: 1 });
MedicationSchema.index({ status: 1 });
MedicationSchema.index({ 'inventory.expiryDate': 1 });

const Medication = mongoose.model('Medication', MedicationSchema);

module.exports = Medication;