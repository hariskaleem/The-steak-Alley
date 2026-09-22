const express = require('express');
const router  = express.Router();
const { getProfile, updateAddresses, updatePayments } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile',  protect, getProfile);
router.put('/addresses', protect, updateAddresses);
router.put('/payments',  protect, updatePayments);

module.exports = router;
