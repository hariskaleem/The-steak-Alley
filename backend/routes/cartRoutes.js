const express = require('express');
const router  = express.Router();
const { getCart, updateCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',  protect, getCart);
router.put('/',  protect, updateCart);

module.exports = router;
