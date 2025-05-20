import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout(); // notify App to clear user state
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>I - MART</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/add-product">Add Product</Link>
        <Link to="/products">Product Display</Link>
        <Link to="/cart">Cart</Link>

        {user ? (
          <>
            <span style={{ marginLeft: "1rem" }}>Welcome, {user.name}</span>
            <button
              onClick={handleLogout}
               className="logout-btn"
              style={{ marginLeft: "1rem", cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
