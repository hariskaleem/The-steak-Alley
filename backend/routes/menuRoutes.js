const express = require('express');
const router  = express.Router();
const {
  getMenuItems,
  uploadImage,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect }      = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const upload           = require('../middleware/uploadMiddleware');

router.get('/',           getMenuItems);
router.post('/upload',    protect, requireAdmin, upload.single('image'), uploadImage);
router.post('/',          protect, requireAdmin, createMenuItem);
router.put('/:id',        protect, requireAdmin, updateMenuItem);
router.delete('/:id',     protect, requireAdmin, deleteMenuItem);

module.exports = router;
