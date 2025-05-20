import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import { AddProducts } from "./Components/Product";
import { Home } from "./Components/Home";
import Navbar from "./Components/Navbar";
import { ProductDisplay } from "./Components/ProductDisplay";
import { CartPage } from "./Components/CartPage";
import { Login } from "./Components/Login";
import { Register } from "./Components/Register";

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle login - store user info in state and localStorage
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Handle logout - clear user info
  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/add-product" element={user ? <AddProducts /> : <Navigate to="/login" />} />

   
        <Route path="/products" element={<ProductDisplay />} />

        <Route
          path="/cart"
          element={user ? <CartPage /> : <Navigate to="/login" />}
        />

        {/* Auth pages */}
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
