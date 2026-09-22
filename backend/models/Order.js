const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id:       String,
  name:     { type: String, required: true },
  price:    { type: String, required: true },
  image:    { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    items:       { type: [orderItemSchema], required: true },

    // Pricing
    subtotal:     { type: Number, required: true },
    discount:     { type: Number, default: 0 },
    shippingCost: { type: Number, required: true },
    tax:          { type: Number, required: true },
    total:        { type: Number, required: true },
    promoCode:    { type: String, default: '' },

    // Delivery
    deliveryMethod:  { type: String, enum: ['standard', 'express', 'overnight'], default: 'standard' },
    deliveryAddress: {
      street:  String,
      city:    String,
      state:   String,
      zip:     String,
      country: String,
    },

    // Payment
    paymentMethod: { type: String, default: 'card' },

    // Contact
    contactName:  String,
    contactEmail: String,
    contactPhone: String,

    status: {
      type: String,
      enum: ['confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
