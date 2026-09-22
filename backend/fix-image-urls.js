/**
 * Migration: Replace all localhost:5000 imageUrl references in MenuItem
 * with the LAN IP so real devices can load images.
 * Run once with: node fix-image-urls.js  (from the backend folder)
 */
require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

const OLD = "http://localhost:5000";
const NEW = process.env.APP_URL || "http://localhost:5000";

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const items = await MenuItem.find({ imageUrl: { $regex: OLD } });
    console.log(`Found ${items.length} items with localhost image URLs`);

    let updated = 0;
    for (const item of items) {
      item.imageUrl = item.imageUrl.replace(OLD, NEW);
      await item.save();
      console.log(`  Updated: ${item.name}`);
      updated++;
    }

    console.log(`\nDone! Updated ${updated} items.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
})();
