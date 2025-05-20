import { useEffect, useState } from "react";
import "./ProductDisplay.css";

export function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // For category filter
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching Products:", error));
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    fetch("http://localhost:3001/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user.id,
        productId: product._id,
        quantity: 1,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`${product.name} added to cart!`);
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSortChange = (e) => setSortOrder(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // Get unique categories from products for dropdown options
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="product-display-container">
      <h2>Product List</h2>
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <h4>Categories</h4>
          <ul className="category-list">
            <li
              className={!selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory("")}
            >
              All
            </li>
            {categories.map((cat) => (
              <li
                key={cat}
                className={selectedCategory === cat ? "active" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Products Section */}
        <div className="products-section">
          <div className="search-sort-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="">Sort by Price</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          <div className="products">
            {filteredProducts.map((product) => (
              <div
                className="product-card"
                key={product._id}
                onClick={() => openModal(product)}
              >
                <div className="product-content">
                  <h4>{product.name}</h4>
                  <h5>₹{product.price}</h5>
                  <img src={product.image} alt={product.name} />
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedProduct.name}</h2>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
            />
            <p>
              <strong>Price:</strong> ₹{selectedProduct.price}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
