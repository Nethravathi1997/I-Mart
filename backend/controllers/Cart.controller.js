const Cart = require("../models/Cart.model");

// Get cart items for a specific user with product details populated
const getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Map products to include full product details + quantity
    const formattedProducts = cart.products.map(item => ({
      _id: item._id,               // subdocument id for cart item
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Add product to cart for a specific user
const addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Find cart of user or create new
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if product already in cart
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      // Increment quantity
      cart.products[productIndex].quantity += 1;
    } else {
      // Add new product with quantity 1
      cart.products.push({ productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Update cart item quantity for a specific user
const updateCartItem = async (req, res) => {
  const { id } = req.params;         // cart item's _id (subdocument id)
  const { quantity, userId } = req.body;

  try {
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.id(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

// Delete cart item for a specific user
const deleteCartItem = async (req, res) => {
  const { id } = req.params;  // cart item's _id (subdocument id)
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.id(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.remove();
    await cart.save();

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart item", error });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
};
