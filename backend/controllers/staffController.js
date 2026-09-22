const Staff = require('../models/Staff');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Admin only
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ name: 1 }).lean();
    res.status(200).json({ staff });
  } catch (error) {
    console.error('getAllStaff error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Add a new staff member
// @route   POST /api/staff
// @access  Admin only
const addStaff = async (req, res) => {
  try {
    const { name, role, email, phone, salary, shift, status, joinDate, notes } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required.' });
    }

    const staffData = {
      name,
      role,
      phone,
      salary,
      shift,
      status,
      joinDate,
      notes,
    };

    // Only include email if non-empty so sparse unique index works correctly
    if (email && email.trim() !== '') staffData.email = email.trim();

    const member = await Staff.create(staffData);
    res.status(201).json({ message: 'Staff member added.', staff: member });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A staff member with this email already exists.' });
    }
    console.error('addStaff error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Update a staff member
// @route   PUT /api/staff/:id
// @access  Admin only
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone, salary, shift, status, joinDate, notes } = req.body;

    // Build $set for fields to update and $unset for fields to clear
    const $set = { name, role, phone, salary, shift, status, joinDate, notes };
    const $unset = {};

    if (email && email.trim() !== '') {
      $set.email = email.trim();
    } else {
      // Explicitly unset email in MongoDB so it is actually removed
      $unset.email = '';
    }

    const updateOp = Object.keys($unset).length > 0 ? { $set, $unset } : { $set };

    const member = await Staff.findByIdAndUpdate(id, updateOp, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: 'Staff member not found.' });
    }

    res.status(200).json({ message: 'Staff member updated.', staff: member });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A staff member with this email already exists.' });
    }
    console.error('updateStaff error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/staff/:id
// @access  Admin only
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Staff.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ message: 'Staff member not found.' });
    }

    res.status(200).json({ message: 'Staff member removed.' });
  } catch (error) {
    console.error('deleteStaff error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllStaff, addStaff, updateStaff, deleteStaff };
