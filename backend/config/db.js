const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB URI from .env file
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGO_URI is not defined in the .env file");
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
  console.error("⚠️ MongoDB connection error:", err.message);
});

// Handle disconnection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Reconnecting...");
  connectDB();
});

module.exports = connectDB;
