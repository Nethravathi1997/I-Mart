  // 📁 controllers/auth.controller.js
  const User = require("../models/User.model");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const JWT_SECRET = "mySuperSecretKey123";

  exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Register data received:", req.body);
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = new User({ name, email, password });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({
        token,
        user: {
          id: user._id,  
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

