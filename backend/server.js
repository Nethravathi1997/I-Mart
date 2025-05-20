const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import the database connection function
const productsRoute = require("./routes/product.routes");
const cartRouter = require("./routes/Cart.routes");
const authRoutes = require("./routes/User.routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB(); // Call the function to connect to MongoDB

// Use routes
app.use("/products", productsRoute);
app.use("/cart", cartRouter);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
