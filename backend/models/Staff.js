const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['Chef', 'Waiter', 'Manager', 'Cashier', 'Host', 'Cleaner', 'Security', 'Other'],
      default: 'Waiter',
    },
    email: {
      type: String,
      unique: true,
      sparse: true,          // allow multiple docs with no email
      lowercase: true,
      trim: true,
      match: [/^(\S+@\S+\.\S+)?$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
      default: 0,
    },
    shift: {
      type: String,
      enum: ['Morning', 'Evening', 'Night'],
      default: 'Morning',
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Terminated'],
      default: 'Active',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
