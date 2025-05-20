const express = require("express");
const {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/Cart.controller");

const router = express.Router();

// Get cart items for a specific user (userId passed as query or param)
router.get("/:userId", getCartItems);

// Add item to cart - expects userId in body
router.post("/", addToCart);

// Update quantity of a cart item by item ID (userId in body)
router.put("/:id", updateCartItem);

// Delete a cart item by item ID (userId in body)
router.delete("/:id", deleteCartItem);

module.exports = router;
