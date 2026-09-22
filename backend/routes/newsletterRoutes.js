const express = require("express");
const { subscribe, getSubscribers, deleteSubscriber } = require("../controllers/newsletterController");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/", protect, requireAdmin, getSubscribers);
router.delete("/:id", protect, requireAdmin, deleteSubscriber);

module.exports = router;
