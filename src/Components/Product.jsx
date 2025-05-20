import { useEffect, useState } from "react";
import "./product.css";

export function AddProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [products, setProducts] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editImage, setEditImage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const validateFields = (fields) => {
    return fields.every((field) => field !== "" && field !== null && field !== undefined && !(typeof field === "number" && field <= 0));
  };

  const addProduct = async () => {
    if (!validateFields([name, price, image, category, description])) {
      alert("Please fill all fields with valid data");
      return;
    }

    const newProduct = { name, price, image, category, description };

    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        alert("Product added successfully");
        resetForm();
        fetchProducts();
      } else {
        alert("Error adding product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to connect to server");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Product deleted");
        fetchProducts();
      } else {
        alert("Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to connect to server");
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditImage(product.image);
    setEditCategory(product.category);
    setEditDescription(product.description);
  };

  const cancelEdit = () => {
    setEditId(null);
    resetForm();
  };

  const updateProduct = async () => {
    if (!validateFields([editName, editPrice, editImage, editCategory, editDescription])) {
      alert("Please fill all fields with valid data");
      return;
    }

    const updatedProduct = {
      name: editName,
      price: editPrice,
      image: editImage,
      category: editCategory,
      description: editDescription,
    };

    try {
      const response = await fetch(`http://localhost:3001/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        alert("Product updated");
        cancelEdit();
        fetchProducts();
      } else {
        alert("Error updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to connect to server");
    }
  };

  const resetForm = () => {
    setName("");
    setPrice(0);
    setImage("");
    setCategory("");
    setDescription("");
    setEditName("");
    setEditPrice(0);
    setEditImage("");
    setEditCategory("");
    setEditDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateProduct();
    } else {
      addProduct();
    }
  };

  return (
    <div className="add-product-container">
      <h2>{editId ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name</label>
        <input
          id="name"
          type="text"
          placeholder="Product Name"
          value={editId ? editName : name}
          onChange={(e) => (editId ? setEditName(e.target.value) : setName(e.target.value))}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          placeholder="Price"
          value={editId ? editPrice : price}
          onChange={(e) => (editId ? setEditPrice(Number(e.target.value)) : setPrice(Number(e.target.value)))}
          min={1}
          required
        />

        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          type="text"
          placeholder="Image URL"
          value={editId ? editImage : image}
          onChange={(e) => (editId ? setEditImage(e.target.value) : setImage(e.target.value))}
          required
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={editId ? editCategory : category}
          onChange={(e) => (editId ? setEditCategory(e.target.value) : setCategory(e.target.value))}
          required
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          <option value="Books">Books</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Product Description"
          value={editId ? editDescription : description}
          onChange={(e) => (editId ? setEditDescription(e.target.value) : setDescription(e.target.value))}
          required
        />

        <button type="submit">{editId ? "Update Product" : "Add Product"}</button>
        {editId && (
          <button type="button" onClick={cancelEdit} className="cancel-btn">
            Cancel Edit
          </button>
        )}
      </form>

      <h3>Product List</h3>
      <div className="products-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h4>{product.name}</h4>
              <p>₹ {product.price}</p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>{product.description}</p>
            </div>
            <div className="product-actions">
              <button onClick={() => startEdit(product)}>Edit</button>
              <button onClick={() => deleteProduct(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
