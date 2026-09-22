const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name:          { type: String,  required: true, trim: true },
    category:      { type: String,  required: true, trim: true },
    price:         { type: Number,  required: true, min: 0 },
    ingredients:   { type: [String], default: [] },
    description:   { type: String,  default: '', trim: true },
    imageUrl:      { type: String,  default: '' },
    imagePosition: { type: String,  default: '50% 50%' },
    available:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
