const Cart = require('../models/Cart');

// @desc    Get the current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    res.status(200).json({ items: cart ? cart.items : [] });
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Replace the current user's cart (full sync)
// @route   PUT /api/cart
// @access  Private
const updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'items must be an array.' });
    }
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { user: req.user.id, items },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error('updateCart error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getCart, updateCart };
