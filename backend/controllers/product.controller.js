const Product = require("../models/Products.model")


//Getting products

const getAllProducts = async(req,res) => {
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch{
        res.status(500).json({message:"Error fetching data:",error})
    }
}

//Add new Products

const addProduct = async(req,res) => {
    const {name,price,image,category,description} = req.body;

    try{
        const newProduct = new Product({name,price,image,category,description});
        await newProduct.save();
        res.status(201).json(newProduct);
    }catch{
        res.status(500).json({message:"Error adding Product:",error})
    }
}


// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image,category,description} = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, image,category,description },
      { new: true } // to return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

module.exports = {getAllProducts,addProduct,deleteProduct,updateProduct};