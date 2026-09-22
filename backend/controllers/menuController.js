const path = require("path");
const MenuItem = require("../models/MenuItem");

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 }).lean();
    res.status(200).json({ items });
  } catch (error) {
    console.error("getMenuItems error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Upload a dish image
// @route   POST /api/menu/upload
// @access  Admin only
const uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded." });

  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}` || "http://localhost:5000";
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Admin only
const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, ingredients, description, imageUrl, available } = req.body;

    if (!name || !category || price == null) {
      return res.status(400).json({ message: "Name, category, and price are required." });
    }

    const item = await MenuItem.create({ name, category, price, ingredients, description, imageUrl, available });
    res.status(201).json({ item });
  } catch (error) {
    console.error("createMenuItem error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Admin only
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!item) return res.status(404).json({ message: "Item not found." });
    res.status(200).json({ item });
  } catch (error) {
    console.error("updateMenuItem error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Admin only
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.status(200).json({ message: "Item deleted." });
  } catch (error) {
    console.error("deleteMenuItem error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getMenuItems, uploadImage, createMenuItem, updateMenuItem, deleteMenuItem };
