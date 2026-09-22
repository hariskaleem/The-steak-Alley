const express = require('express');
const router  = express.Router();
const { getStats, getAllOrders, getAdmins, createAdmin, changeAdminPassword } = require('../controllers/adminController');
const { protect }       = require('../middleware/authMiddleware');
const { requireAdmin }  = require('../middleware/adminMiddleware');

router.get('/stats',  protect, requireAdmin, getStats);
router.get('/orders', protect, requireAdmin, getAllOrders);

// ── Admin management ──────────────────────────────────────────────────────────
router.get   ('/admins',                  protect, requireAdmin, getAdmins);
router.post  ('/admins',                  protect, requireAdmin, createAdmin);
router.put   ('/admins/:id/password',     protect, requireAdmin, changeAdminPassword);

module.exports = router;
