const Order = require('../models/Order');
const Cart  = require('../models/Cart');
const crypto = require('crypto');

// Helper: generate a unique order number using crypto for better entropy
const genOrderNumber = () =>
  '#SH-' + crypto.randomBytes(3).toString('hex').toUpperCase();

// @desc    Create a new order and clear the cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal, discount, shippingCost, tax, total,
      promoCode,
      deliveryMethod,
      deliveryAddress,
      paymentMethod,
      contactName,
      contactEmail,
      contactPhone,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    // Generate unique order number (retry on collision)
    let orderNumber;
    let attempts = 0;
    do {
      orderNumber = genOrderNumber();
      attempts++;
    } while ((await Order.exists({ orderNumber })) && attempts < 5);

    if (await Order.exists({ orderNumber })) {
      return res.status(500).json({ message: 'Could not generate a unique order number. Please try again.' });
    }

    const order = await Order.create({
      user: req.user.id,
      orderNumber,
      items,
      subtotal,
      discount:     discount     || 0,
      shippingCost: shippingCost || 4.99,
      tax:          tax          || 0,
      total,
      promoCode:    promoCode    || '',
      deliveryMethod:  deliveryMethod  || 'standard',
      deliveryAddress: deliveryAddress || {},
      paymentMethod:   paymentMethod   || 'card',
      contactName:     contactName     || '',
      contactEmail:    contactEmail    || '',
      contactPhone:    contactPhone    || '',
      status: 'confirmed',
    });

    // Clear the user's DB cart
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { upsert: true }
    );

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id:          order._id,
        orderNumber: order.orderNumber,
        total:       order.total,
        status:      order.status,
        createdAt:   order.createdAt,
      },
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Get all orders for the logged-in user (newest first)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Also return aggregate stats for the dashboard
    const totalOrders = orders.length;
    const totalSpent  = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    res.status(200).json({ orders, totalOrders, totalSpent });
  } catch (error) {
    console.error('getOrders error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createOrder, getOrders };
