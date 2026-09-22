const Order    = require('../models/Order');
const User     = require('../models/User');
const MenuItem = require('../models/MenuItem');

// Status map: DB value → display label
const STATUS_LABEL = {
  confirmed:   'Confirmed',
  preparing:   'Preparing',
  on_the_way:  'On the way',
  delivered:   'Delivered',
  cancelled:   'Cancelled',
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
const getStats = async (req, res) => {
  try {
    // Start of today (midnight local server time, in UTC)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalOrders, totalCustomers, todayRevenueAgg, totalRevenueAgg, menuItemCount] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ isAdmin: false }),
        // Today's revenue
        Order.aggregate([
          { $match: { createdAt: { $gte: startOfToday } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        // All-time total revenue
        Order.aggregate([
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
        MenuItem.countDocuments(),
      ]);

    const todayRevenue = todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;
    const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

    res.status(200).json({ totalOrders, totalCustomers, todayRevenue, totalRevenue, menuItemCount });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get ALL orders (admin view, newest first)
// @route   GET /api/admin/orders
// @access  Admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName')
      .lean();

    const shaped = orders.map((o) => ({
      id:           o.orderNumber,
      _id:          o._id,
      customer:     o.contactName || (o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest'),
      items:        o.items.map((i) => `${i.name} ×${i.quantity}`).join(', '),
      total:        `Rs ${Number(o.total).toLocaleString('en-PK', { minimumFractionDigits: 0 })}`,
      rawTotal:     o.total,
      status:       STATUS_LABEL[o.status] || o.status,
      deliveryMethod: o.deliveryMethod,
      createdAt:    o.createdAt,
    }));

    res.status(200).json({ orders: shaped });
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Get all admin users
// @route   GET /api/admin/admins
// @access  Admin only
const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true }).select('-password').lean();
    res.status(200).json({ admins });
  } catch (error) {
    console.error('getAdmins error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Create a new admin account
// @route   POST /api/admin/admins
// @access  Admin only
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const admin = await User.create({ firstName, lastName, email, phone, password, isAdmin: true });
    res.status(201).json({
      message: `Admin account created for ${admin.firstName} ${admin.lastName}.`,
      admin: { id: admin._id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email, phone: admin.phone },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    console.error('createAdmin error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Change an admin's password
// @route   PUT /api/admin/admins/:id/password
// @access  Admin only
const changeAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    const admin = await User.findOne({ _id: req.params.id, isAdmin: true }).select('+password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    admin.password = newPassword; // pre-save hook hashes it
    await admin.save();
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('changeAdminPassword error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getStats, getAllOrders, getAdmins, createAdmin, changeAdminPassword };
