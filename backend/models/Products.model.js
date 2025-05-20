const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name:{type:String, required: true},
    price:{type: Number, required: true},
    image:{type:String, required:true},
    description:{type:String, required:true},
    category: {
  type: String,
  required: true,
  enum: [
    "All categories",
    "Clothing",
    "Beauty",
    "Kitchen",
    "Men Fashion",
    "Jewellery",
    "Home",
    "Kids",
  ],
}

})

const Product = mongoose.model("Product",ProductSchema);
module.exports = Product;