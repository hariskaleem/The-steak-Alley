const mongoose = require('mongoose');

const connectDB = async () => {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('MONGODB_URI is not configured. Add your MongoDB Atlas connection string to backend/.env.');
  }

  try {
    const conn = await mongoose.connect(connectionString);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
