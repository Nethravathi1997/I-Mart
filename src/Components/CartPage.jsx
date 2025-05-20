import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CartPage.css'

export function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // Load userId and token from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      setUserId(user.id); // adjust if your user id key is different
      setToken(token);
    } else {
      alert("Please login to access your cart");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch cart items when userId and token are available
  useEffect(() => {
    if (!userId || !token) return;

    fetch(`http://localhost:3001/cart/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.clear();
          navigate("/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to fetch cart");
        return res.json();
      })
      .then((data) => {
        if (data) setCartItems(data);
      })
      .catch((err) => console.error(err));
  }, [userId, token, navigate]);

  // Update quantity handler
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // prevent quantity < 1

    try {
      const res = await fetch(`http://localhost:3001/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, quantity: newQuantity }),
      });
      if (res.ok) {
        // refresh cart
        const updatedCart = await res.json();
        // or just refetch
        fetch(`http://localhost:3001/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then(setCartItems);
      } else {
        alert("Failed to update quantity");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Remove item handler
  const removeItem = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:3001/cart/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      } else {
        alert("Failed to remove item");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate total price
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Checkout button handler
  const handleCheckout = () => {
    alert(`Checkout successful! Total: ₹${totalAmount}`);
    // Add your real checkout logic here
  };

  if (!userId || !token) return null; // or a loader

  return (
   <div className="cart-page">
  <h2>🛒 Your Cart</h2>

  {cartItems.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <>
      {cartItems.map(({ _id, name, price, image, quantity }) => (
        <div key={_id} className="cart-item">
          <img src={image} alt={name} />
          <div>
            <h4>{name}</h4>
            <p>Price: ₹{price}</p>
            <div>
              Quantity:{" "}
              <button onClick={() => updateQuantity(_id, quantity - 1)}>-</button>{" "}
              {quantity}{" "}
              <button onClick={() => updateQuantity(_id, quantity + 1)}>+</button>
            </div>
            <p>Subtotal: ₹{price * quantity}</p>
          </div>
          <button onClick={() => removeItem(_id)}>Remove</button>
        </div>
      ))}

      <h3>Total: ₹{totalAmount}</h3>
      <button onClick={handleCheckout}>Checkout</button>
    </>
  )}
</div>

  );
}
