const express = require("express");
const {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", addProduct);

// Delete product by id
router.delete("/:id", deleteProduct);

// Update product by id
router.put("/:id", updateProduct);

module.exports = router;
