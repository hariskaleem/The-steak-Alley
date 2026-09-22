const express = require('express');
const router  = express.Router();
const { getAllStaff, addStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { protect }       = require('../middleware/authMiddleware');
const { requireAdmin }  = require('../middleware/adminMiddleware');

router.get('/',     protect, requireAdmin, getAllStaff);
router.post('/',    protect, requireAdmin, addStaff);
router.put('/:id',  protect, requireAdmin, updateStaff);
router.delete('/:id', protect, requireAdmin, deleteStaff);

module.exports = router;
