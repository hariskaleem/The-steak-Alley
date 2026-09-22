const User = require('../models/User');

// @desc    Get user profile (addresses + payment methods)
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({
      user: {
        id:             user._id,
        firstName:      user.firstName,
        lastName:       user.lastName,
        email:          user.email,
        phone:          user.phone,
        addresses:      user.addresses,
        paymentMethods: user.paymentMethods,
      },
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Replace the user's saved addresses
// @route   PUT /api/user/addresses
// @access  Private
const updateAddresses = async (req, res) => {
  try {
    const { addresses } = req.body;
    if (!Array.isArray(addresses)) {
      return res.status(400).json({ message: 'addresses must be an array.' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { addresses },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error('updateAddresses error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Replace the user's saved payment methods
// @route   PUT /api/user/payments
// @access  Private
const updatePayments = async (req, res) => {
  try {
    const { paymentMethods } = req.body;
    if (!Array.isArray(paymentMethods)) {
      return res.status(400).json({ message: 'paymentMethods must be an array.' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { paymentMethods },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ paymentMethods: user.paymentMethods });
  } catch (error) {
    console.error('updatePayments error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getProfile, updateAddresses, updatePayments };
