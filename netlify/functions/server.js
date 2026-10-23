/**
 * Netlify Function entry point.
 * This file re-exports the serverless handler from the backend.
 */
const path = require("path");

// Load env from the backend folder
require("dotenv").config({ path: path.join(__dirname, "../../backend/.env") });

// Re-use the fully configured Express app + serverless wrapper
const { handler } = require("../../backend/server");

module.exports = { handler };
